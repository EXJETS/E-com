"use client";

import { useState } from "react";
import { INVENTORY_CAPACITY } from "@/game/core/inventory";
import { itemName } from "@/game/core/items";
import { GameEngine } from "@/game/engine/engine";
import { COOKING, Recipe, SMELTING, SMITHING } from "@/game/engine/recipes";
import { SHOP_STOCK, buyPrice, sellPrice } from "@/game/engine/shop";
import { Position } from "@/game/world/position";
import ItemIcon from "./ItemIcon";

/** Which pop-up is open, if any. */
export type Modal =
  | { kind: "bank" }
  | { kind: "shop"; keeper: string }
  | { kind: "smelt"; at: Position }
  | { kind: "smith"; at: Position }
  | { kind: "cook"; at: Position }
  | { kind: "dialogue"; speaker: string; lines: string[] }
  | null;

function Frame({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div
        className="w-full max-w-2xl rounded-lg border border-[#6B5136] bg-[#2B2118] text-[#F2E8D5] shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#6B5136] px-4 py-2.5">
          <h3 className="font-semibold text-sm">{title}</h3>
          <button onClick={onClose} className="text-[#B9A78A] hover:text-[#F2E8D5] text-lg leading-none">
            ×
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

function Button({ children, onClick, disabled }: { children: React.ReactNode; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="rounded border border-[#6B5136] bg-[#3B2E22] px-2.5 py-1.5 text-[11px] font-semibold hover:bg-[#4A3B2C] disabled:opacity-40 disabled:hover:bg-[#3B2E22]"
    >
      {children}
    </button>
  );
}

function Row({
  children,
  selected,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-[11px] ${
        selected ? "bg-[#6B5136]" : "hover:bg-[#3B2E22]"
      } ${disabled ? "text-[#6B5136]" : "text-[#F2E8D5]"}`}
    >
      {children}
    </button>
  );
}

/** Everything the bank, shop and crafting menus need: a list, a selection and a few buttons. */
export default function GameDialogs({
  engine,
  modal,
  onClose,
  onChange,
}: {
  engine: GameEngine;
  modal: Modal;
  onClose: () => void;
  onChange: () => void;
}) {
  const [selected, setSelected] = useState<string | number | null>(null);

  if (!modal) return null;

  const act = (run: () => void) => {
    run();
    onChange();
  };

  const backpackRows = () =>
    Array.from({ length: INVENTORY_CAPACITY }, (_, index) => index)
      .map((index) => ({ index, slot: engine.player.inventory.slot(index) }))
      .filter((entry) => entry.slot !== null);

  if (modal.kind === "bank") {
    return (
      <Frame title="Bank of Ashvale" onClose={onClose}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <h4 className="mb-1 text-[11px] uppercase tracking-wide text-[#B9A78A]">Bank</h4>
            <div className="h-56 overflow-y-auto rounded bg-[#1F1811] p-1">
              {engine.player.bank.entries().length === 0 && (
                <p className="p-2 text-[11px] text-[#6B5136]">Your bank is empty.</p>
              )}
              {engine.player.bank.entries().map(([id, count]) => (
                <Row key={id} selected={selected === id} onClick={() => setSelected(id)}>
                  <ItemIcon id={id} size={20} />
                  <span className="flex-1">{itemName(id)}</span>
                  <span className="text-[#E0B341]">{count.toLocaleString()}</span>
                </Row>
              ))}
            </div>
            <div className="mt-2 flex gap-1.5">
              {[1, 10, Number.MAX_SAFE_INTEGER].map((amount) => (
                <Button
                  key={amount}
                  disabled={typeof selected !== "string"}
                  onClick={() => act(() => engine.bankWithdraw(selected as string, amount))}
                >
                  {amount === Number.MAX_SAFE_INTEGER ? "Withdraw all" : `Withdraw ${amount}`}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-1 text-[11px] uppercase tracking-wide text-[#B9A78A]">Backpack</h4>
            <div className="h-56 overflow-y-auto rounded bg-[#1F1811] p-1">
              {backpackRows().map(({ index, slot }) => (
                <Row key={index} selected={selected === index} onClick={() => setSelected(index)}>
                  <ItemIcon id={slot!.id} size={20} />
                  <span className="flex-1">{itemName(slot!.id)}</span>
                  {slot!.count > 1 && <span className="text-[#E0B341]">{slot!.count}</span>}
                </Row>
              ))}
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {[1, 10, Number.MAX_SAFE_INTEGER].map((amount) => (
                <Button
                  key={amount}
                  disabled={typeof selected !== "number"}
                  onClick={() => act(() => engine.bankDeposit(selected as number, amount))}
                >
                  {amount === Number.MAX_SAFE_INTEGER ? "Deposit all" : `Deposit ${amount}`}
                </Button>
              ))}
              <Button onClick={() => act(() => engine.bankDepositAll())}>Deposit everything</Button>
            </div>
          </div>
        </div>
      </Frame>
    );
  }

  if (modal.kind === "shop") {
    return (
      <Frame title={`${modal.keeper}'s general store`} onClose={onClose}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <h4 className="mb-1 text-[11px] uppercase tracking-wide text-[#B9A78A]">For sale</h4>
            <div className="h-56 overflow-y-auto rounded bg-[#1F1811] p-1">
              {SHOP_STOCK.map((id) => (
                <Row key={id} selected={selected === id} onClick={() => setSelected(id)}>
                  <ItemIcon id={id} size={20} />
                  <span className="flex-1">{itemName(id)}</span>
                  <span className="text-[#E0B341]">{buyPrice(id)} gp</span>
                </Row>
              ))}
            </div>
            <div className="mt-2 flex gap-1.5">
              {[1, 5].map((amount) => (
                <Button
                  key={amount}
                  disabled={typeof selected !== "string"}
                  onClick={() => act(() => engine.buy(selected as string, amount))}
                >
                  Buy {amount}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-1 text-[11px] uppercase tracking-wide text-[#B9A78A]">Your backpack</h4>
            <div className="h-56 overflow-y-auto rounded bg-[#1F1811] p-1">
              {backpackRows().map(({ index, slot }) => (
                <Row key={index} selected={selected === index} onClick={() => setSelected(index)}>
                  <ItemIcon id={slot!.id} size={20} />
                  <span className="flex-1">
                    {itemName(slot!.id)}
                    {slot!.count > 1 ? ` x ${slot!.count}` : ""}
                  </span>
                  <span className="text-[#E0B341]">{sellPrice(slot!.id)} gp</span>
                </Row>
              ))}
            </div>
            <div className="mt-2 flex gap-1.5">
              <Button
                disabled={typeof selected !== "number"}
                onClick={() => act(() => engine.sell(selected as number, 1))}
              >
                Sell 1
              </Button>
              <Button
                disabled={typeof selected !== "number"}
                onClick={() => act(() => engine.sell(selected as number, Number.MAX_SAFE_INTEGER))}
              >
                Sell all
              </Button>
            </div>
            <p className="mt-2 text-[11px] text-[#B9A78A]">
              You have {engine.player.inventory.count("coins").toLocaleString()} coins.
            </p>
          </div>
        </div>
      </Frame>
    );
  }

  if (modal.kind === "dialogue") {
    return (
      <Frame title={modal.speaker} onClose={onClose}>
        <div className="space-y-1.5 text-[13px] leading-relaxed">
          {modal.lines.map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
        <div className="mt-4">
          <Button onClick={onClose}>Continue</Button>
        </div>
      </Frame>
    );
  }

  // The three crafting menus share one shape: pick a recipe, pick a quantity.
  const options: { id: string; label: string; usable: boolean }[] = [];
  let title = "";
  let start: (id: string, quantity: number) => void = () => {};

  if (modal.kind === "smelt") {
    title = "Furnace";
    for (const [id, recipe] of Object.entries(SMELTING)) {
      options.push({ id, label: describeRecipe(id, recipe), usable: canMake(engine, recipe) });
    }
    start = (id, quantity) => engine.startSmelting(id, quantity, modal.at);
  } else if (modal.kind === "smith") {
    title = "Anvil";
    for (const [id, recipe] of Object.entries(SMITHING)) {
      const bar = Object.keys(recipe.inputs)[0];
      if (!engine.player.inventory.contains(bar)) continue;
      options.push({ id, label: describeRecipe(id, recipe), usable: canMake(engine, recipe) });
    }
    start = (id, quantity) => engine.startSmithing(id, quantity, modal.at);
  } else {
    title = "Cooking";
    for (const raw of engine.player.inventory.distinctIds()) {
      const recipe = COOKING[raw];
      if (!recipe) continue;
      options.push({
        id: raw,
        label: `${itemName(raw)} (level ${recipe.levelRequired}) — you have ${engine.player.inventory.count(raw)}`,
        usable: engine.player.skills.level("cooking") >= recipe.levelRequired,
      });
    }
    start = (id, quantity) => engine.startCooking(id, quantity, modal.at);
  }

  return (
    <Frame title={title} onClose={onClose}>
      {options.length === 0 ? (
        <p className="text-[12px] text-[#B9A78A]">You have nothing to work with here.</p>
      ) : (
        <>
          <div className="max-h-64 overflow-y-auto rounded bg-[#1F1811] p-1">
            {options.map((option) => (
              <Row
                key={option.id}
                selected={selected === option.id}
                disabled={!option.usable}
                onClick={() => option.usable && setSelected(option.id)}
              >
                <ItemIcon id={option.id} size={20} />
                <span>{option.label}</span>
              </Row>
            ))}
          </div>
          <div className="mt-3 flex gap-1.5">
            {[1, 5, 10, 28].map((quantity) => (
              <Button
                key={quantity}
                disabled={typeof selected !== "string"}
                onClick={() =>
                  act(() => {
                    start(selected as string, quantity);
                    onClose();
                  })
                }
              >
                {quantity === 28 ? "All" : `Make ${quantity}`}
              </Button>
            ))}
          </div>
        </>
      )}
    </Frame>
  );
}

function describeRecipe(id: string, recipe: Recipe): string {
  const inputs = Object.entries(recipe.inputs)
    .map(([input, count]) => `${count} ${itemName(input).toLowerCase()}`)
    .join(", ");
  return `${itemName(id)} (level ${recipe.levelRequired}) — ${inputs}`;
}

function canMake(engine: GameEngine, recipe: Recipe): boolean {
  return (
    engine.player.skills.level(recipe.skill) >= recipe.levelRequired &&
    Object.entries(recipe.inputs).every(([id, count]) => engine.player.inventory.contains(id, count))
  );
}
