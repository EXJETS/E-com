import { Npc } from "../npc/npc";
import { npcDef } from "../npc/defs";
import { WorldObject, objectFromSymbol } from "./objects";
import { parsePosition, pos } from "./position";
import { TileType, tileFromSymbol } from "./tiles";
import { World } from "./world";

/**
 * Reads a map: a metadata block, a grid of terrain symbols, a matching grid of scenery
 * symbols and a list of npc spawns.
 */
export function loadWorld(text: string): World {
  let name = "Unnamed";
  let width = 0;
  let height = 0;
  let spawn = pos(0, 0);
  const tileRows: string[] = [];
  const objectRows: string[] = [];
  const npcRows: string[] = [];

  let section = "";
  for (const line of text.split("\n")) {
    if (!line.trim()) continue;
    if (line.startsWith("[") && line.trimEnd().endsWith("]")) {
      section = line.trim().slice(1, -1);
      continue;
    }
    if (section === "meta") {
      const [key, value] = line.split("=", 2).map((part) => part.trim());
      if (key === "name") name = value;
      else if (key === "width") width = Number.parseInt(value, 10);
      else if (key === "height") height = Number.parseInt(value, 10);
      else if (key === "spawn") spawn = parsePosition(value);
    } else if (section === "tiles") tileRows.push(line);
    else if (section === "objects") objectRows.push(line);
    else if (section === "npcs") npcRows.push(line);
  }

  if (width <= 0 || height <= 0) throw new Error("The map is missing its width or height");
  if (tileRows.length < height) {
    throw new Error(`The map declares ${height} rows but has ${tileRows.length}`);
  }

  const tiles: TileType[][] = [];
  for (let y = 0; y < height; y++) {
    const row: TileType[] = [];
    for (let x = 0; x < width; x++) {
      row.push(tileFromSymbol(tileRows[y][x] ?? "."));
    }
    tiles.push(row);
  }
  const world = new World(name, width, height, tiles, spawn);

  for (let y = 0; y < Math.min(height, objectRows.length); y++) {
    const row = objectRows[y];
    for (let x = 0; x < Math.min(width, row.length); x++) {
      const type = objectFromSymbol(row[x]);
      if (!type) continue;
      // Scenery that drifted onto a wall or into the water while the map was authored is
      // dropped, except for fishing spots, which belong on the water.
      const onWater = tiles[y][x] === "water";
      const fishing = type === "shrimp_spot" || type === "trout_spot";
      if (fishing !== onWater) continue;
      if (!fishing && !world.isWalkable(pos(x, y))) continue;
      world.addObject(new WorldObject(type, pos(x, y)));
    }
  }

  for (const row of npcRows) {
    const parts = row.split(",");
    if (parts.length < 3) continue;
    const x = Number.parseInt(parts[0].trim(), 10);
    const y = Number.parseInt(parts[1].trim(), 10);
    const radius = parts.length > 3 ? Number.parseInt(parts[3].trim(), 10) : 3;
    world.npcs.push(new Npc(npcDef(parts[2].trim()), pos(x, y), radius));
  }
  return world;
}
