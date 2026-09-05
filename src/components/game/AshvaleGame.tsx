"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { EquipSlot, itemDef, itemName } from "@/game/core/items";
import { GameEngine, TICK_MS } from "@/game/engine/engine";
import { FIREMAKING } from "@/game/engine/recipes";
import { questProgressText } from "@/game/engine/quest";
import { clearStorage, loadFromStorage, saveToStorage } from "@/game/save";
import { createGame, giveStarterKit } from "@/game/setup";
import { drawScene, cameraFor, tileAtPixel } from "@/game/ui/render";
import { Position } from "@/game/world/position";
import { TILE_INFO } from "@/game/world/tiles";
import { npcCombatLevel } from "@/game/npc/defs";
import GameDialogs, { Modal } from "./GameDialogs";
import GamePanels, { PanelTab } from "./GamePanels";

const AUTOSAVE_INTERVAL_TICKS = 250;

interface MenuEntry {
  label: string;
  run: () => void;
}

interface ContextMenu {
  x: number;
  y: number;
  entries: MenuEntry[];
}

export default function AshvaleGame() {
  const [modal, setModal] = useState<Modal>(null);
  const [engine] = useState<GameEngine>(() => createEngine(setModal));
  const [tab, setTab] = useState<PanelTab>("items");
  const [useSlot, setUseSlot] = useState(-1);
  const [menu, setMenu] = useState<ContextMenu | null>(null);
  const [command, setCommand] = useState("");
  const [hoverTile, setHoverTile] = useState<Position | null>(null);
  const [, redraw] = useReducer((count: number) => count + 1, 0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const hoverRef = useRef<Position | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const sizeRef = useRef({ width: 0, height: 0 });

  // ---------------------------------------------------------------- the clock

  useEffect(() => {
    const timer = window.setInterval(() => {
      engine.tick();
      if (engine.tickCount % AUTOSAVE_INTERVAL_TICKS === 0) saveToStorage(engine.player);
      redraw();
    }, TICK_MS);
    return () => window.clearInterval(timer);
  }, [engine]);

  useEffect(() => {
    const save = () => saveToStorage(engine.player);
    window.addEventListener("beforeunload", save);
    return () => {
      window.removeEventListener("beforeunload", save);
      save();
    };
  }, [engine]);

  // ---------------------------------------------------------------- painting

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      const width = wrapper.clientWidth;
      const height = wrapper.clientHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      sizeRef.current = { width, height };
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(wrapper);

    let frame = 0;
    const paint = () => {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const ratio = window.devicePixelRatio || 1;
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
        drawScene(ctx, engine, sizeRef.current.width, sizeRef.current.height, hoverRef.current);
      }
      frame = window.requestAnimationFrame(paint);
    };
    frame = window.requestAnimationFrame(paint);
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [engine]);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight });
  });

  // ---------------------------------------------------------------- input

  const tileFromEvent = useCallback(
    (event: { clientX: number; clientY: number }): Position | null => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const bounds = canvas.getBoundingClientRect();
      const camera = cameraFor(engine, sizeRef.current.width, sizeRef.current.height);
      return tileAtPixel(camera, event.clientX - bounds.left, event.clientY - bounds.top);
    },
    [engine],
  );

  const worldEntries = useCallback(
    (tile: Position): MenuEntry[] => {
      const entries: MenuEntry[] = [];
      const npc = engine.world.npcAt(tile);
      if (npc) {
        if (npc.def.attackable) {
          entries.push({
            label: `Attack ${npc.name} (level ${npcCombatLevel(npc.def)})`,
            run: () => engine.attack(npc),
          });
        }
        entries.push({ label: `Talk to ${npc.name}`, run: () => engine.talkTo(npc) });
        entries.push({
          label: `Examine ${npc.name}`,
          run: () =>
            engine.message(
              `${npc.name} - level ${npcCombatLevel(npc.def)}, ${npc.hitpoints()}/${npc.maxHitpoints()} hitpoints.`,
            ),
        });
      }
      const object = engine.world.objectAt(tile);
      if (object) {
        entries.push({
          label: `${object.info.action} ${object.info.name}`,
          run: () => engine.interact(object),
        });
      }
      const groundItem = engine.world.groundItemAt(tile);
      if (groundItem) {
        entries.push({ label: `Take ${itemName(groundItem.itemId)}`, run: () => engine.pickUp(groundItem) });
      }
      entries.push({ label: "Walk here", run: () => engine.walkTo(tile) });
      entries.push({
        label: `Examine ${TILE_INFO[engine.world.tileAt(tile)].name.toLowerCase()}`,
        run: () => engine.message(`It is ${TILE_INFO[engine.world.tileAt(tile)].name.toLowerCase()}.`),
      });
      return entries;
    },
    [engine],
  );

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    setMenu(null);
    const tile = tileFromEvent(event);
    if (!tile) return;
    const npc = engine.world.npcAt(tile);
    if (npc) {
      if (npc.def.attackable) engine.attack(npc);
      else engine.talkTo(npc);
      return;
    }
    const object = engine.world.objectAt(tile);
    if (object) {
      engine.interact(object);
      return;
    }
    const groundItem = engine.world.groundItemAt(tile);
    if (groundItem) {
      engine.pickUp(groundItem);
      return;
    }
    engine.walkTo(tile);
  };

  const handleCanvasMenu = (event: React.MouseEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    const tile = tileFromEvent(event);
    if (!tile) return;
    setMenu({ x: event.clientX, y: event.clientY, entries: worldEntries(tile) });
  };

  const handleSlotClick = (index: number) => {
    setMenu(null);
    const slot = engine.player.inventory.slot(index);
    if (!slot) {
      setUseSlot(-1);
      return;
    }
    if (useSlot >= 0 && useSlot !== index) {
      engine.useItemOnItem(useSlot, index);
      setUseSlot(-1);
      redraw();
      return;
    }
    const def = itemDef(slot.id);
    if (def.heals > 0) engine.eat(index);
    else if (def.slot) engine.equip(index);
    else {
      setUseSlot(index);
      engine.message(`Use ${def.name.toLowerCase()} with...`);
    }
    redraw();
  };

  const handleSlotMenu = (index: number, x: number, y: number) => {
    const slot = engine.player.inventory.slot(index);
    if (!slot) return;
    const def = itemDef(slot.id);
    const entries: MenuEntry[] = [];
    if (def.heals > 0) entries.push({ label: "Eat", run: () => engine.eat(index) });
    if (def.slot) entries.push({ label: "Wear / wield", run: () => engine.equip(index) });
    if (slot.id in FIREMAKING) entries.push({ label: "Light fire", run: () => engine.lightFire(slot.id) });
    entries.push({
      label: "Use",
      run: () => {
        setUseSlot(index);
        engine.message(`Use ${def.name.toLowerCase()} with...`);
      },
    });
    entries.push({ label: "Drop", run: () => engine.drop(index) });
    entries.push({
      label: "Examine",
      run: () =>
        engine.message(
          `${def.name} - worth ${def.value} coins${def.heals > 0 ? `, heals ${def.heals}` : ""}${
            def.slot ? ` (attack +${def.attackBonus}, strength +${def.strengthBonus}, defence +${def.defenceBonus})` : ""
          }.`,
        ),
    });
    setMenu({ x, y, entries });
  };

  const runCommand = (text: string) => {
    if (!text.startsWith("/")) {
      engine.message(`${engine.player.name}: ${text}`);
      return;
    }
    const [name] = text.slice(1).split(/\s+/);
    switch (name.toLowerCase()) {
      case "help":
        engine.message("Commands: /save /reset /where /stop /run /style /quest");
        break;
      case "save":
        saveToStorage(engine.player);
        engine.message("Character saved in this browser.");
        break;
      case "reset":
        clearStorage();
        engine.message("Saved character cleared. Reload the page to start over.");
        break;
      case "where":
        engine.message(`You are standing at ${engine.player.position.x},${engine.player.position.y}.`);
        break;
      case "stop":
        engine.stopAction();
        engine.player.clearPath();
        engine.message("You stop what you were doing.");
        break;
      case "run":
        engine.toggleRun();
        break;
      case "style":
        engine.cycleAttackStyle();
        break;
      case "quest":
        engine.message(questProgressText(engine.player.questStage));
        break;
      default:
        engine.message("Unknown command. Try /help.");
    }
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const typing = event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement;
      if (event.key === "Escape") {
        setMenu(null);
        setModal(null);
        engine.stopAction();
        engine.player.clearPath();
        redraw();
        return;
      }
      if (typing) return;
      if (event.key.toLowerCase() === "r") {
        engine.toggleRun();
        redraw();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [engine]);

  useEffect(() => {
    const close = () => setMenu(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  // ---------------------------------------------------------------- render

  const action = engine.currentAction();
  const status = action ? action.description : engine.player.isMoving() ? "Walking" : "Idle";

  return (
    <div className="flex flex-col gap-3 lg:flex-row">
      <div className="min-w-0 flex-1">
        <div
          ref={wrapperRef}
          className="relative h-[420px] overflow-hidden rounded-lg border border-[#6B5136] bg-black sm:h-[544px]"
        >
          <canvas
            ref={canvasRef}
            className="h-full w-full cursor-pointer touch-none"
            style={{ imageRendering: "auto" }}
            onClick={handleCanvasClick}
            onContextMenu={handleCanvasMenu}
            onMouseMove={(event) => {
              const tile = tileFromEvent(event);
              hoverRef.current = tile;
              // Only re-render when the cursor crosses into a different tile.
              setHoverTile((previous) =>
                previous && tile && previous.x === tile.x && previous.y === tile.y ? previous : tile,
              );
            }}
            onMouseLeave={() => {
              hoverRef.current = null;
              setHoverTile(null);
            }}
          />
          <div className="pointer-events-none absolute bottom-2 left-2 rounded bg-black/60 px-2 py-1 text-[11px] text-[#B9A78A]">
            {status}
          </div>
          {hoverTile && <HoverLabel engine={engine} tile={hoverTile} />}
        </div>

        <div className="mt-3 rounded-lg border border-[#6B5136] bg-[#2B2118]">
          <div ref={chatRef} className="h-32 overflow-y-auto px-3 py-2 text-[12px] leading-relaxed text-[#F2E8D5]">
            {engine.messages.map((message, index) => (
              <p key={index}>{message}</p>
            ))}
          </div>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              const text = command.trim();
              setCommand("");
              if (text) {
                runCommand(text);
                redraw();
              }
            }}
            className="border-t border-[#6B5136]"
          >
            <input
              value={command}
              onChange={(event) => setCommand(event.target.value)}
              placeholder="Type /help for commands"
              className="w-full bg-[#3B2E22] px-3 py-2 text-[12px] text-[#F2E8D5] placeholder:text-[#6B5136] focus:outline-none"
            />
          </form>
        </div>
      </div>

      <GamePanels
        engine={engine}
        tab={tab}
        onTab={setTab}
        useSlot={useSlot}
        onSlotClick={handleSlotClick}
        onSlotMenu={handleSlotMenu}
        onUnequip={(slot: EquipSlot) => {
          engine.unequip(slot);
          redraw();
        }}
        onToggleStyle={() => {
          engine.cycleAttackStyle();
          redraw();
        }}
        onToggleRun={() => {
          engine.toggleRun();
          redraw();
        }}
      />

      {menu && (
        <ul
          className="fixed z-50 min-w-44 overflow-hidden rounded border border-[#6B5136] bg-[#2B2118] py-1 text-[12px] text-[#F2E8D5] shadow-xl"
          style={{ left: menu.x, top: menu.y }}
          onClick={(event) => event.stopPropagation()}
        >
          {menu.entries.map((entry, index) => (
            <li key={index}>
              <button
                className="w-full px-3 py-1.5 text-left hover:bg-[#3B2E22]"
                onClick={() => {
                  entry.run();
                  setMenu(null);
                  redraw();
                }}
              >
                {entry.label}
              </button>
            </li>
          ))}
        </ul>
      )}

      <GameDialogs engine={engine} modal={modal} onClose={() => setModal(null)} onChange={redraw} />
    </div>
  );
}

/** Builds the world, restores the character from this browser and wires the pop-ups up. */
function createEngine(openModal: (modal: Modal) => void): GameEngine {
  const engine = createGame();
  const restored = loadFromStorage(engine.player);
  if (!restored) giveStarterKit(engine.player);
  engine.message(`Welcome to ${engine.world.name}, ${engine.player.name}.`);
  engine.message(
    restored
      ? "Your character was restored from this browser."
      : "Left click to walk and interact. Right click anything for its options.",
  );
  engine.events = {
    onOpenBank: () => openModal({ kind: "bank" }),
    onOpenShop: (npc) => openModal({ kind: "shop", keeper: npc.name }),
    onOpenSmelting: (at) => openModal({ kind: "smelt", at }),
    onOpenSmithing: (at) => openModal({ kind: "smith", at }),
    onOpenCooking: (at) => openModal({ kind: "cook", at }),
    onDialogue: (npc, lines) => openModal({ kind: "dialogue", speaker: npc.name, lines }),
  };
  return engine;
}

/** The "Chop down Tree" style label that follows the cursor. */
function HoverLabel({ engine, tile }: { engine: GameEngine; tile: Position }) {
  const npc = engine.world.npcAt(tile);
  const object = engine.world.objectAt(tile);
  const groundItem = engine.world.groundItemAt(tile);
  let label: string | null = null;
  if (npc) {
    label = npc.def.attackable ? `Attack ${npc.name} (level ${npcCombatLevel(npc.def)})` : `Talk to ${npc.name}`;
  } else if (object) {
    label = `${object.info.action} ${object.info.name}`;
  } else if (groundItem) {
    label = `Take ${itemName(groundItem.itemId)}`;
  }
  if (!label) return null;
  return (
    <div className="pointer-events-none absolute left-2 top-2 rounded bg-black/60 px-2 py-1 text-[12px] font-semibold text-[#E0B341]">
      {label}
    </div>
  );
}
