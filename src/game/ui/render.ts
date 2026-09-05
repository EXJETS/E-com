import { ItemDef } from "../core/items";
import { GameEngine } from "../engine/engine";
import { Npc } from "../npc/npc";
import { OBJECT_INFO, ObjectType } from "../world/objects";
import { Position, pos } from "../world/position";
import { TILE_INFO, TileType } from "../world/tiles";
import { itemDef } from "../core/items";

export const TILE = 32;

/** Deterministic per-tile shade, so terrain does not look like flat paint. */
function jitter(hex: string, x: number, y: number, amount: number): string {
  const hash = (x * 73856093) ^ (y * 19349663);
  const delta = (((hash % (amount * 2 + 1)) + amount * 2 + 1) % (amount * 2 + 1)) - amount;
  return shade(hex, 1 + delta / 100);
}

export function shade(hex: string, factor: number): string {
  const value = Number.parseInt(hex.slice(1), 16);
  const clamp = (channel: number) => Math.max(0, Math.min(255, Math.round(channel * factor)));
  const r = clamp((value >> 16) & 0xff);
  const g = clamp((value >> 8) & 0xff);
  const b = clamp(value & 0xff);
  return `rgb(${r}, ${g}, ${b})`;
}

function blend(hex: string, tint: string, amount: number): string {
  const parse = (color: string) => {
    const value = Number.parseInt(color.slice(1), 16);
    return [(value >> 16) & 0xff, (value >> 8) & 0xff, value & 0xff];
  };
  const [r1, g1, b1] = parse(hex);
  const [r2, g2, b2] = parse(tint);
  const mix = (a: number, b: number) => Math.round(a * (1 - amount) + b * amount);
  return `rgb(${mix(r1, r2)}, ${mix(g1, g2)}, ${mix(b1, b2)})`;
}

export interface Camera {
  x: number;
  y: number;
}

/**
 * Top left pixel of the view. The player stays centred until the edge of the region, where
 * the camera stops so the view never fills with empty space.
 */
export function cameraFor(engine: GameEngine, viewWidth: number, viewHeight: number): Camera {
  const clamp = (centre: number, view: number, worldSize: number) => {
    const max = worldSize * TILE - view;
    if (max <= 0) return max / 2;
    return Math.max(0, Math.min(max, centre * TILE + TILE / 2 - view / 2));
  };
  return {
    x: clamp(engine.player.position.x, viewWidth, engine.world.width),
    y: clamp(engine.player.position.y, viewHeight, engine.world.height),
  };
}

export function tileAtPixel(camera: Camera, x: number, y: number): Position {
  return pos(Math.floor((x + camera.x) / TILE), Math.floor((y + camera.y) / TILE));
}

export function drawScene(
  ctx: CanvasRenderingContext2D,
  engine: GameEngine,
  viewWidth: number,
  viewHeight: number,
  hover: Position | null,
): void {
  const camera = cameraFor(engine, viewWidth, viewHeight);
  const world = engine.world;
  const tick = engine.tickCount;

  ctx.clearRect(0, 0, viewWidth, viewHeight);
  ctx.fillStyle = "#101010";
  ctx.fillRect(0, 0, viewWidth, viewHeight);

  const firstX = Math.max(0, Math.floor(camera.x / TILE));
  const firstY = Math.max(0, Math.floor(camera.y / TILE));
  const lastX = Math.min(world.width - 1, Math.floor((camera.x + viewWidth) / TILE));
  const lastY = Math.min(world.height - 1, Math.floor((camera.y + viewHeight) / TILE));

  for (let y = firstY; y <= lastY; y++) {
    for (let x = firstX; x <= lastX; x++) {
      drawTile(ctx, engine, x, y, x * TILE - camera.x, y * TILE - camera.y, tick);
    }
  }

  for (const item of world.groundItems) {
    const { x, y } = item.position;
    if (x < firstX || x > lastX || y < firstY || y > lastY) continue;
    drawItemIcon(ctx, itemDef(item.itemId), x * TILE - camera.x + 6, y * TILE - camera.y + 6, TILE - 12);
  }

  for (const npc of world.npcs) {
    if (!npc.isVisible()) continue;
    const { x, y } = npc.position;
    if (x < firstX - 1 || x > lastX + 1 || y < firstY - 1 || y > lastY + 1) continue;
    drawNpc(ctx, npc, x * TILE - camera.x, y * TILE - camera.y);
  }

  drawPlayer(ctx, engine, engine.player.position.x * TILE - camera.x, engine.player.position.y * TILE - camera.y);

  if (hover) {
    ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
    ctx.lineWidth = 2;
    ctx.strokeRect(hover.x * TILE - camera.x + 1, hover.y * TILE - camera.y + 1, TILE - 2, TILE - 2);
    ctx.lineWidth = 1;
  }

  drawMinimap(ctx, engine, viewWidth);
}

function drawTile(
  ctx: CanvasRenderingContext2D,
  engine: GameEngine,
  x: number,
  y: number,
  px: number,
  py: number,
  tick: number,
): void {
  const type: TileType = engine.world.tile(x, y);
  const info = TILE_INFO[type];
  let color = jitter(info.color, x, y, 3);
  if (type === "water") {
    const shimmer = (tick + x * 3 + y * 5) % 14;
    if (shimmer < 2) color = shade(info.color, 1.1);
  }
  ctx.fillStyle = color;
  ctx.fillRect(px, py, TILE, TILE);
  drawTexture(ctx, type, x, y, px, py);

  if (type === "wall") {
    ctx.strokeStyle = shade(info.color, 0.75);
    ctx.beginPath();
    ctx.moveTo(px, py + TILE / 2);
    ctx.lineTo(px + TILE, py + TILE / 2);
    ctx.moveTo(px + TILE / 2, py);
    ctx.lineTo(px + TILE / 2, py + TILE / 2);
    ctx.stroke();
  } else if (type === "fence") {
    ctx.fillStyle = shade(info.color, 1.3);
    ctx.fillRect(px + TILE / 3, py + 2, 4, TILE - 4);
    ctx.fillRect(px + 2, py + TILE / 3, TILE - 4, 4);
  }

  const object = engine.world.objectAt(pos(x, y));
  if (object) drawObject(ctx, object.type, px, py, object.isDepleted(), tick);
}

/** A few deterministic specks so grass, sand and floors read as surfaces. */
function drawTexture(ctx: CanvasRenderingContext2D, type: TileType, x: number, y: number, px: number, py: number): void {
  const hash = Math.abs((x * 73856093) ^ (y * 19349663));
  const info = TILE_INFO[type];
  if (type === "grass") {
    ctx.strokeStyle = shade(info.color, 1.12);
    ctx.beginPath();
    for (let blade = 0; blade < 3; blade++) {
      const bx = px + ((hash >> (blade * 5)) % (TILE - 6)) + 3;
      const by = py + ((hash >> (blade * 7 + 2)) % (TILE - 6)) + 3;
      ctx.moveTo(bx, by);
      ctx.lineTo(bx, by - 3);
    }
    ctx.stroke();
  } else if (type === "sand" || type === "dirt") {
    ctx.fillStyle = shade(info.color, 0.9);
    for (let speck = 0; speck < 3; speck++) {
      const sx = px + ((hash >> (speck * 4)) % (TILE - 4)) + 2;
      const sy = py + ((hash >> (speck * 6 + 1)) % (TILE - 4)) + 2;
      ctx.fillRect(sx, sy, 2, 2);
    }
  } else if (type === "floor") {
    ctx.strokeStyle = shade(info.color, 0.88);
    ctx.beginPath();
    ctx.moveTo(px, py + TILE - 1);
    ctx.lineTo(px + TILE, py + TILE - 1);
    ctx.stroke();
  } else if (type === "road") {
    ctx.fillStyle = shade(info.color, 0.96);
    ctx.fillRect(px + (hash % 20), py + (hash % 22), 3, 2);
  }
}

function drawObject(
  ctx: CanvasRenderingContext2D,
  type: ObjectType,
  x: number,
  y: number,
  depleted: boolean,
  tick: number,
): void {
  switch (type) {
    case "tree": return drawTree(ctx, x, y, depleted, "#2F6B23", 0.78);
    case "oak": return drawTree(ctx, x, y, depleted, "#3F7A24", 0.92);
    case "willow": return drawTree(ctx, x, y, depleted, "#6FA83C", 0.86);
    case "copper_rock": return drawRock(ctx, x, y, depleted, "#C2701C");
    case "tin_rock": return drawRock(ctx, x, y, depleted, "#D6D3D1");
    case "iron_rock": return drawRock(ctx, x, y, depleted, "#9B4A3A");
    case "coal_rock": return drawRock(ctx, x, y, depleted, "#1F2937");
    case "shrimp_spot":
    case "trout_spot": return drawFishingSpot(ctx, x, y, tick);
    case "furnace": return drawFurnace(ctx, x, y, tick);
    case "anvil": return drawAnvil(ctx, x, y);
    case "bank_booth": return drawBankBooth(ctx, x, y);
    case "range": return drawRange(ctx, x, y);
    case "fire": return drawFire(ctx, x, y, tick);
    case "shop_counter": return drawCounter(ctx, x, y);
    case "door": return drawDoor(ctx, x, y);
  }
}

function circle(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
  ctx.beginPath();
  ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
  ctx.fill();
}

function polygon(ctx: CanvasRenderingContext2D, points: [number, number][], stroke?: string): void {
  ctx.beginPath();
  points.forEach(([x, y], index) => (index === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
  ctx.closePath();
  ctx.fill();
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.stroke();
  }
}

function drawTree(ctx: CanvasRenderingContext2D, x: number, y: number, stump: boolean, leaves: string, scale: number): void {
  const trunkWidth = Math.max(3, TILE / 6);
  ctx.fillStyle = "#5B3A1E";
  ctx.fillRect(x + TILE / 2 - trunkWidth / 2, y + TILE / 2, trunkWidth, TILE / 2 - 2);
  if (stump) {
    ctx.fillStyle = "#7C5326";
    circle(ctx, x + TILE / 2 - trunkWidth, y + TILE / 2 - trunkWidth / 2, trunkWidth * 2, trunkWidth);
    return;
  }
  const canopy = TILE * scale;
  const cx = x + TILE / 2 - canopy / 2;
  const cy = y + TILE / 2 - (canopy * 3) / 4;
  ctx.fillStyle = shade(leaves, 0.75);
  circle(ctx, cx - 2, cy + 4, canopy, canopy);
  ctx.fillStyle = leaves;
  circle(ctx, cx, cy, canopy, canopy - 2);
  ctx.fillStyle = shade(leaves, 1.25);
  circle(ctx, cx + canopy / 5, cy + canopy / 6, canopy / 3, canopy / 3);
}

function drawRock(ctx: CanvasRenderingContext2D, x: number, y: number, mined: boolean, ore: string): void {
  const inset = TILE / 8;
  ctx.fillStyle = mined ? "#57534E" : blend("#8A837C", ore, 0.35);
  polygon(
    ctx,
    [
      [x + inset, y + TILE - inset],
      [x + inset + TILE / 8, y + TILE / 2],
      [x + TILE / 2, y + inset + (mined ? TILE / 4 : 0)],
      [x + TILE - inset - TILE / 8, y + TILE / 2],
      [x + TILE - inset, y + TILE - inset],
    ],
    "#3F3B37",
  );
  if (!mined) {
    ctx.fillStyle = ore;
    circle(ctx, x + TILE / 3, y + TILE / 2, TILE / 5, TILE / 5);
    circle(ctx, x + TILE / 2, y + TILE / 2 + TILE / 8, TILE / 6, TILE / 6);
    circle(ctx, x + TILE / 2 - TILE / 8, y + TILE / 3, TILE / 7, TILE / 7);
  }
}

function drawFishingSpot(ctx: CanvasRenderingContext2D, x: number, y: number, tick: number): void {
  ctx.lineWidth = 2;
  for (let ring = 0; ring < 3; ring++) {
    const phase = (tick + ring * 3) % 9;
    const radius = TILE / 6 + (phase * TILE) / 24;
    ctx.strokeStyle = `rgba(200, 235, 255, ${Math.max(0.08, 0.55 - phase * 0.06)})`;
    ctx.beginPath();
    ctx.arc(x + TILE / 2, y + TILE / 2, radius, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.lineWidth = 1;
}

function drawFurnace(ctx: CanvasRenderingContext2D, x: number, y: number, tick: number): void {
  ctx.fillStyle = "#57534E";
  ctx.fillRect(x + 2, y + TILE / 4, TILE - 4, TILE - TILE / 4 - 2);
  ctx.fillStyle = "#292524";
  ctx.beginPath();
  ctx.arc(x + TILE / 2, y + TILE * 0.75, TILE / 4, Math.PI, 0);
  ctx.fill();
  ctx.fillStyle = tick % 2 === 0 ? "#F97316" : "#FACC15";
  ctx.beginPath();
  ctx.arc(x + TILE / 2, y + TILE * 0.78, TILE / 6, Math.PI, 0);
  ctx.fill();
  ctx.fillStyle = "#78716C";
  ctx.fillRect(x + TILE / 3, y + 2, TILE / 3, TILE / 4);
}

function drawAnvil(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  ctx.fillStyle = "#3F3F46";
  ctx.fillRect(x + TILE / 4, y + TILE / 2, TILE / 2, TILE / 6);
  ctx.fillRect(x + TILE / 3, y + TILE / 2 + TILE / 6, TILE / 3, TILE / 5);
  ctx.fillRect(x + TILE / 5, y + TILE - TILE / 4, (TILE * 3) / 5, TILE / 6);
  ctx.fillStyle = "#71717A";
  ctx.fillRect(x + TILE / 4, y + TILE / 2, TILE / 2, 3);
}

function drawBankBooth(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  ctx.fillStyle = "#4E3A21";
  ctx.fillRect(x + 2, y + TILE / 3, TILE - 4, (TILE * 2) / 3 - 2);
  ctx.fillStyle = "#8A6A3B";
  ctx.fillRect(x + 2, y + TILE / 3, TILE - 4, TILE / 6);
  ctx.fillStyle = "#E0B341";
  ctx.font = "bold 13px system-ui, sans-serif";
  ctx.fillText("$", x + TILE / 2 - 4, y + TILE - TILE / 5);
}

function drawRange(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  ctx.fillStyle = "#44403C";
  ctx.fillRect(x + 2, y + TILE / 4, TILE - 4, TILE - TILE / 4 - 2);
  ctx.fillStyle = "#1C1917";
  ctx.fillRect(x + TILE / 5, y + TILE / 2, (TILE * 3) / 5, TILE / 3);
  ctx.fillStyle = "#EA580C";
  ctx.fillRect(x + TILE / 4, y + TILE / 2 + TILE / 8, TILE / 2, TILE / 8);
}

function drawFire(ctx: CanvasRenderingContext2D, x: number, y: number, tick: number): void {
  ctx.fillStyle = "#57534E";
  ctx.fillRect(x + TILE / 4, y + TILE - TILE / 4, TILE / 2, TILE / 6);
  const flicker = tick % 3;
  ctx.fillStyle = "#EA580C";
  polygon(ctx, [
    [x + TILE / 2, y + TILE / 5 - flicker],
    [x + TILE - TILE / 5, y + TILE - TILE / 4],
    [x + TILE / 5, y + TILE - TILE / 4],
  ]);
  ctx.fillStyle = "#FBBF24";
  polygon(ctx, [
    [x + TILE / 2, y + TILE / 2 - flicker],
    [x + (TILE * 2) / 3, y + TILE - TILE / 4],
    [x + TILE / 3, y + TILE - TILE / 4],
  ]);
}

function drawCounter(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  ctx.fillStyle = "#6B4423";
  ctx.fillRect(x + 1, y + TILE / 2, TILE - 2, TILE / 2 - 2);
  ctx.fillStyle = "#8B5E3C";
  ctx.fillRect(x + 1, y + TILE / 2, TILE - 2, TILE / 8);
}

function drawDoor(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  ctx.strokeStyle = "#3F2C18";
  ctx.strokeRect(x + TILE / 6, y + TILE / 6, TILE - TILE / 3, TILE - TILE / 3);
}

function drawNpc(ctx: CanvasRenderingContext2D, npc: Npc, px: number, py: number): void {
  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  circle(ctx, px + 5, py + TILE - 10, TILE - 10, 7);
  drawCreature(ctx, npc.def.key, npc.def.color, px, py);
  if (npc.hitpoints() < npc.maxHitpoints()) {
    drawHealthBar(ctx, px + 4, py, TILE - 8, npc.hitpoints(), npc.maxHitpoints());
  }
  if (npc.lastDamage() >= 0) drawHitsplat(ctx, px + TILE / 2, py + TILE / 2, npc.lastDamage());
}

/** Creature portraits: simple shapes, but each kind is recognisable at a glance. */
function drawCreature(ctx: CanvasRenderingContext2D, key: string, color: string, x: number, y: number): void {
  const body = TILE - 10;
  const bx = x + 5;
  const by = y + 6;
  ctx.fillStyle = color;
  switch (key) {
    case "chicken":
      circle(ctx, bx + 2, by + 4, body - 4, body - 6);
      circle(ctx, bx + body / 3, by, body / 2, body / 2);
      ctx.fillStyle = "#F97316";
      polygon(ctx, [
        [bx + body - 2, by + body / 5],
        [bx + body + 4, by + body / 4],
        [bx + body - 2, by + body / 3],
      ]);
      ctx.fillStyle = "#DC2626";
      circle(ctx, bx + body / 2, by - 3, body / 4, body / 4);
      break;
    case "cow":
      ctx.fillRect(bx, by + 3, body, body - 4);
      ctx.fillStyle = "#1C1917";
      circle(ctx, bx + 2, by + 5, body / 3, body / 3);
      circle(ctx, bx + body / 2, by + body / 2, body / 3, body / 3);
      ctx.fillStyle = "#FDE68A";
      ctx.fillRect(bx - 2, by + 2, 3, 3);
      ctx.fillRect(bx + body - 1, by + 2, 3, 3);
      break;
    case "goblin":
      circle(ctx, bx + 1, by + 2, body - 2, body);
      polygon(ctx, [
        [bx, by + body / 3],
        [bx - 4, by + body / 4],
        [bx + 2, by + body / 2],
      ]);
      polygon(ctx, [
        [bx + body, by + body / 3],
        [bx + body + 4, by + body / 4],
        [bx + body - 2, by + body / 2],
      ]);
      ctx.fillStyle = "#FCA5A5";
      circle(ctx, bx + body / 4, by + body / 3, 3, 3);
      circle(ctx, bx + (body * 2) / 3, by + body / 3, 3, 3);
      break;
    case "guard":
      ctx.fillRect(bx + 1, by + body / 3, body - 2, (body * 2) / 3);
      ctx.fillStyle = "#F5D0A9";
      circle(ctx, bx + body / 4, by + 1, body / 2, body / 2);
      ctx.fillStyle = "#94A3B8";
      ctx.beginPath();
      ctx.arc(bx + body / 2, by + body / 4 + 1, body / 4, Math.PI, 0);
      ctx.fill();
      break;
    case "giant_rat":
      circle(ctx, bx, by + body / 3, body, body / 2);
      circle(ctx, bx + (body * 2) / 3, by + body / 4, body / 2, body / 2);
      break;
    default:
      ctx.fillRect(bx + 1, by + body / 3, body - 2, (body * 2) / 3);
      ctx.fillStyle = "#F5D0A9";
      circle(ctx, bx + body / 4, by, body / 2, body / 2);
  }
}

function drawPlayer(ctx: CanvasRenderingContext2D, engine: GameEngine, px: number, py: number): void {
  const player = engine.player;
  ctx.fillStyle = "rgba(0, 0, 0, 0.28)";
  circle(ctx, px + 6, py + TILE - 9, TILE - 12, 7);

  const bodyId = player.equipment.get("body");
  const legsId = player.equipment.get("legs");
  ctx.fillStyle = legsId ? itemDef(legsId).color : "#475569";
  ctx.fillRect(px + TILE / 3, py + (TILE * 5) / 8, TILE / 3, TILE / 4);
  ctx.fillStyle = bodyId ? itemDef(bodyId).color : "#8B5CF6";
  ctx.fillRect(px + TILE / 4, py + TILE / 3, TILE / 2, TILE / 3);
  const headId = player.equipment.get("head");
  ctx.fillStyle = headId ? itemDef(headId).color : "#F5D0A9";
  circle(ctx, px + TILE / 3, py + TILE / 6, TILE / 3, TILE / 3);
  const weaponId = player.equipment.get("weapon");
  if (weaponId) {
    ctx.fillStyle = itemDef(weaponId).color;
    ctx.fillRect(px + (TILE * 3) / 4 - 2, py + TILE / 4, 3, TILE / 2);
  }
  const shieldId = player.equipment.get("shield");
  if (shieldId) {
    ctx.fillStyle = itemDef(shieldId).color;
    ctx.fillRect(px + TILE / 6, py + TILE / 3, 5, TILE / 3);
  }
  drawHealthBar(ctx, px + 4, py, TILE - 8, player.skills.currentHitpoints(), player.skills.maxHitpoints());
  if (player.lastDamage() >= 0) drawHitsplat(ctx, px + TILE / 2, py + TILE / 2, player.lastDamage());
}

function drawHealthBar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  current: number,
  max: number,
): void {
  ctx.fillStyle = "#7F1D1D";
  ctx.fillRect(x, y, width, 4);
  ctx.fillStyle = "#4ADE80";
  ctx.fillRect(x, y, (width * Math.max(0, current)) / max, 4);
}

function drawHitsplat(ctx: CanvasRenderingContext2D, cx: number, cy: number, damage: number): void {
  ctx.fillStyle = damage === 0 ? "#2563EB" : "#D44B3C";
  circle(ctx, cx - 9, cy - 9, 18, 18);
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 11px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(String(damage), cx, cy + 4);
  ctx.textAlign = "left";
}

function drawMinimap(ctx: CanvasRenderingContext2D, engine: GameEngine, viewWidth: number): void {
  const scale = 2;
  const span = 40;
  const size = span * scale;
  const originX = viewWidth - size - 12;
  const originY = 12;
  const centre = engine.player.position;

  ctx.fillStyle = "rgba(0, 0, 0, 0.65)";
  ctx.fillRect(originX - 4, originY - 4, size + 8, size + 8);
  for (let y = 0; y < span; y++) {
    for (let x = 0; x < span; x++) {
      const worldX = centre.x - span / 2 + x;
      const worldY = centre.y - span / 2 + y;
      if (!engine.world.inBounds(worldX, worldY)) continue;
      const object = engine.world.objectAt(pos(worldX, worldY));
      ctx.fillStyle =
        object && OBJECT_INFO[object.type].skill
          ? "#8A6A25"
          : TILE_INFO[engine.world.tile(worldX, worldY)].color;
      ctx.fillRect(originX + x * scale, originY + y * scale, scale, scale);
    }
  }
  for (const npc of engine.world.npcs) {
    if (!npc.isVisible()) continue;
    const dx = npc.position.x - centre.x + span / 2;
    const dy = npc.position.y - centre.y + span / 2;
    if (dx < 0 || dy < 0 || dx >= span || dy >= span) continue;
    ctx.fillStyle = npc.def.attackable ? "#D44B3C" : "#38BDF8";
    ctx.fillRect(originX + dx * scale, originY + dy * scale, scale + 1, scale + 1);
  }
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(originX + (span / 2) * scale, originY + (span / 2) * scale, scale + 1, scale + 1);
  ctx.strokeStyle = "#6B5136";
  ctx.strokeRect(originX - 4, originY - 4, size + 8, size + 8);
}

/** Item icons are a coloured chip plus a hint of the item's shape. */
export function drawItemIcon(ctx: CanvasRenderingContext2D, def: ItemDef, x: number, y: number, size: number): void {
  const color = def.color;
  ctx.fillStyle = color;
  if (def.id === "coins") {
    circle(ctx, x + size / 4, y + size / 3, size / 3, size / 3);
    circle(ctx, x + size / 2 - 2, y + size / 4, size / 3, size / 3);
    circle(ctx, x + size / 3, y + size / 2, size / 3, size / 3);
    return;
  }
  if (def.id.endsWith("logs")) {
    ctx.fillRect(x + size / 8, y + size / 3, (size * 3) / 4, size / 5);
    ctx.fillRect(x + size / 8, y + size / 2, (size * 3) / 4, size / 5);
    return;
  }
  if (def.id.endsWith("_ore") || def.id === "coal") {
    circle(ctx, x + size / 5, y + size / 3, (size * 3) / 5, size / 2);
    ctx.fillStyle = shade(color, 1.3);
    circle(ctx, x + size / 3, y + size / 2, size / 5, size / 5);
    return;
  }
  if (def.id.endsWith("_bar")) {
    ctx.fillRect(x + size / 6, y + size / 2 - 3, (size * 2) / 3, size / 4);
    ctx.fillStyle = shade(color, 1.3);
    ctx.fillRect(x + size / 6, y + size / 2 - 3, (size * 2) / 3, 3);
    return;
  }
  if (def.slot) {
    drawGear(ctx, def, x, y, size);
    return;
  }
  circle(ctx, x + size / 5, y + size / 4, (size * 3) / 5, size / 2);
}

function drawGear(ctx: CanvasRenderingContext2D, def: ItemDef, x: number, y: number, size: number): void {
  ctx.fillStyle = def.color;
  switch (def.slot) {
    case "weapon":
      if (def.toolType === "axe") {
        ctx.fillStyle = "#6B4423";
        ctx.fillRect(x + size / 2 - 2, y + size / 4, 4, size / 2);
        ctx.fillStyle = def.color;
        ctx.beginPath();
        ctx.arc(x + size / 2, y + size / 3, size / 4, -Math.PI / 2, Math.PI / 2);
        ctx.fill();
      } else if (def.toolType === "pickaxe") {
        ctx.fillStyle = "#6B4423";
        ctx.fillRect(x + size / 2 - 2, y + size / 4, 4, size / 2);
        ctx.fillStyle = def.color;
        ctx.beginPath();
        ctx.arc(x + size / 2, y + size / 3, size / 4, Math.PI, 0);
        ctx.fill();
      } else {
        ctx.fillRect(x + size / 2 - 2, y + size / 6, 4, (size * 2) / 3);
        ctx.fillStyle = "#6B4423";
        ctx.fillRect(x + size / 3, y + (size * 3) / 4, size / 3, 4);
      }
      break;
    case "shield":
      polygon(ctx, [
        [x + size / 4, y + size / 5],
        [x + (size * 3) / 4, y + size / 5],
        [x + size / 2, y + (size * 4) / 5],
      ]);
      break;
    case "head":
      ctx.beginPath();
      ctx.arc(x + size / 2, y + size / 2, size / 4, Math.PI, 0);
      ctx.fill();
      break;
    case "body":
      ctx.fillRect(x + size / 4, y + size / 4, size / 2, size / 2);
      ctx.fillRect(x + size / 8, y + size / 4, size / 8, size / 3);
      ctx.fillRect(x + (size * 3) / 4, y + size / 4, size / 8, size / 3);
      break;
    case "legs":
      ctx.fillRect(x + size / 4, y + size / 4, size / 2, size / 5);
      ctx.fillRect(x + size / 4, y + size / 2 - 4, size / 6, size / 3);
      ctx.fillRect(x + size / 2, y + size / 2 - 4, size / 6, size / 3);
      break;
  }
}
