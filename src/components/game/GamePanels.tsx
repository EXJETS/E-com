"use client";

import { EQUIP_SLOTS, EQUIP_SLOT_NAMES, EquipSlot, itemDef, itemName } from "@/game/core/items";
import { INVENTORY_CAPACITY } from "@/game/core/inventory";
import { MAX_RUN_ENERGY } from "@/game/core/player";
import { SKILLS, SKILL_INFO } from "@/game/core/skills";
import { levelProgress } from "@/game/core/xp";
import { STYLE_INFO } from "@/game/combat/formulas";
import { GameEngine } from "@/game/engine/engine";
import {
  QUEST_COMPLETE,
  QUEST_NAME,
  QUEST_REQUIREMENTS,
  QUEST_STARTED,
  questProgressText,
} from "@/game/engine/quest";
import ItemIcon from "./ItemIcon";

export type PanelTab = "items" | "skills" | "worn" | "quest";

const TABS: { id: PanelTab; label: string }[] = [
  { id: "items", label: "Items" },
  { id: "skills", label: "Skills" },
  { id: "worn", label: "Worn" },
  { id: "quest", label: "Quest" },
];

interface Props {
  engine: GameEngine;
  tab: PanelTab;
  onTab: (tab: PanelTab) => void;
  useSlot: number;
  onSlotClick: (index: number) => void;
  onSlotMenu: (index: number, x: number, y: number) => void;
  onUnequip: (slot: EquipSlot) => void;
  onToggleStyle: () => void;
  onToggleRun: () => void;
}

function formatCount(count: number): string {
  if (count >= 1_000_000) return `${Math.floor(count / 1_000_000)}M`;
  if (count >= 100_000) return `${Math.floor(count / 1000)}K`;
  return String(count);
}

export default function GamePanels({
  engine,
  tab,
  onTab,
  useSlot,
  onSlotClick,
  onSlotMenu,
  onUnequip,
  onToggleStyle,
  onToggleRun,
}: Props) {
  const player = engine.player;
  const hp = player.skills.currentHitpoints();
  const maxHp = player.skills.maxHitpoints();

  return (
    <aside className="w-full lg:w-[264px] shrink-0 bg-[#2B2118] border border-[#6B5136] rounded-lg overflow-hidden text-[#F2E8D5]">
      <div className="bg-[#3B2E22] px-3 py-2.5">
        <div className="flex items-baseline justify-between">
          <h2 className="font-semibold text-[15px]">{player.name}</h2>
          <span className="text-[11px] text-[#B9A78A]">
            Combat {player.skills.combatLevel()} · Total {player.skills.totalLevel()}
          </span>
        </div>

        <div className="mt-2 h-4 rounded bg-[#1F1811] overflow-hidden relative">
          <div className="h-full bg-[#4ADE80] transition-all" style={{ width: `${(hp / maxHp) * 100}%` }} />
          <span className="absolute inset-0 text-[10px] leading-4 pl-2 text-[#14301E] font-semibold">
            Hitpoints {hp} / {maxHp}
          </span>
        </div>
        <div className="mt-1 h-3 rounded bg-[#1F1811] overflow-hidden relative">
          <div
            className="h-full bg-[#FACC15] transition-all"
            style={{ width: `${(player.runEnergy / MAX_RUN_ENERGY) * 100}%` }}
          />
          <span className="absolute inset-0 text-[9px] leading-3 pl-2 text-[#3B2A05] font-semibold">
            Energy {player.runEnergy}%
          </span>
        </div>

        <div className="mt-2 flex gap-2">
          <button
            onClick={onToggleStyle}
            className="flex-1 text-[11px] font-semibold rounded border border-[#6B5136] bg-[#1F1811] px-2 py-1.5 text-[#E0B341] hover:bg-[#241C13]"
          >
            Style: {STYLE_INFO[player.attackStyle].name}
          </button>
          <button
            onClick={onToggleRun}
            className={`text-[11px] font-semibold rounded border border-[#6B5136] px-2 py-1.5 ${
              player.runToggled ? "bg-[#E0B341] text-[#2B2118]" : "bg-[#1F1811] text-[#B9A78A]"
            }`}
          >
            {player.runToggled ? "Run on" : "Run off"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 border-b border-[#6B5136]">
        {TABS.map((entry) => (
          <button
            key={entry.id}
            onClick={() => onTab(entry.id)}
            className={`py-1.5 text-[11px] font-semibold ${
              tab === entry.id ? "bg-[#2B2118] text-[#E0B341]" : "bg-[#1F1811] text-[#B9A78A] hover:text-[#F2E8D5]"
            }`}
          >
            {entry.label}
          </button>
        ))}
      </div>

      <div className="p-3">
        {tab === "items" && (
          <>
            <div className="grid grid-cols-4 gap-1.5">
              {Array.from({ length: INVENTORY_CAPACITY }, (_, index) => {
                const slot = player.inventory.slot(index);
                return (
                  <button
                    key={index}
                    onClick={() => onSlotClick(index)}
                    onContextMenu={(event) => {
                      event.preventDefault();
                      if (slot) onSlotMenu(index, event.clientX, event.clientY);
                    }}
                    title={slot ? `${itemName(slot.id)}${slot.count > 1 ? ` x ${slot.count}` : ""}` : undefined}
                    className={`relative aspect-square rounded bg-[#1F1811] border flex items-center justify-center ${
                      index === useSlot ? "border-[#E0B341]" : "border-[#3B2E22] hover:border-[#6B5136]"
                    }`}
                  >
                    {slot && <ItemIcon id={slot.id} size={28} />}
                    {slot && slot.count > 1 && (
                      <span className="absolute top-0 left-0.5 text-[9px] font-bold text-[#E0B341]">
                        {formatCount(slot.count)}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-[10px] text-[#B9A78A]">
              {player.inventory.usedSlots()} / {INVENTORY_CAPACITY} slots used · left click to use, right click for
              more
            </p>
          </>
        )}

        {tab === "skills" && (
          <div className="grid grid-cols-2 gap-1.5">
            {SKILLS.map((skill) => {
              const info = SKILL_INFO[skill];
              const xp = player.skills.xp(skill);
              return (
                <div key={skill} className="rounded bg-[#1F1811] p-1.5" title={`${xp} experience`}>
                  <div className="flex items-baseline justify-between">
                    <span className="text-[11px] font-semibold" style={{ color: info.color }}>
                      {info.name}
                    </span>
                    <span className="text-[11px] text-[#E0B341]">{player.skills.level(skill)}/99</span>
                  </div>
                  <div className="mt-1 h-1 rounded bg-[#3B2E22] overflow-hidden">
                    <div
                      className="h-full"
                      style={{ width: `${levelProgress(xp) * 100}%`, backgroundColor: info.color }}
                    />
                  </div>
                  <span className="text-[9px] text-[#B9A78A]">{xp.toLocaleString()} xp</span>
                </div>
              );
            })}
          </div>
        )}

        {tab === "worn" && (
          <div className="space-y-1.5">
            {EQUIP_SLOTS.map((slot) => {
              const itemId = player.equipment.get(slot);
              return (
                <button
                  key={slot}
                  onClick={() => itemId && onUnequip(slot)}
                  className="w-full flex items-center gap-2 rounded bg-[#1F1811] px-2 py-1.5 text-left hover:bg-[#241C13]"
                >
                  <div className="w-7 h-7 flex items-center justify-center">
                    {itemId && <ItemIcon id={itemId} size={26} />}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[9px] uppercase tracking-wide text-[#B9A78A]">
                      {EQUIP_SLOT_NAMES[slot]}
                    </div>
                    <div className={`text-[11px] truncate ${itemId ? "text-[#F2E8D5]" : "text-[#6B5136]"}`}>
                      {itemId ? itemName(itemId) : "empty"}
                    </div>
                  </div>
                </button>
              );
            })}
            <div className="mt-3 rounded bg-[#1F1811] p-2 text-[11px] text-[#E0B341] space-y-0.5">
              <div>Attack +{player.equipment.attackBonus()}</div>
              <div>Strength +{player.equipment.strengthBonus()}</div>
              <div>Defence +{player.equipment.defenceBonus()}</div>
            </div>
            <p className="text-[10px] text-[#B9A78A]">Click a slot to take the item off.</p>
          </div>
        )}

        {tab === "quest" && (
          <div className="space-y-2">
            <h3 className="font-semibold text-[13px]">{QUEST_NAME}</h3>
            <span
              className={`inline-block text-[11px] font-semibold ${
                player.questStage === QUEST_COMPLETE
                  ? "text-[#4ADE80]"
                  : player.questStage === QUEST_STARTED
                    ? "text-[#E0B341]"
                    : "text-[#B9A78A]"
              }`}
            >
              {player.questStage === QUEST_COMPLETE
                ? "Complete"
                : player.questStage === QUEST_STARTED
                  ? "In progress"
                  : "Not started"}
            </span>
            <p className="text-[11px] text-[#B9A78A] leading-relaxed">{questProgressText(player.questStage)}</p>
            <div className="space-y-1">
              {Object.entries(QUEST_REQUIREMENTS).map(([id, count]) => {
                const held = player.inventory.count(id);
                return (
                  <div
                    key={id}
                    className={`flex items-center justify-between text-[11px] ${
                      held >= count ? "text-[#4ADE80]" : "text-[#B9A78A]"
                    }`}
                  >
                    <span>{itemDef(id).name}</span>
                    <span>
                      {held} / {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
