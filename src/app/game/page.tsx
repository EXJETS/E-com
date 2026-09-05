import type { Metadata } from "next";
import GameMount from "@/components/game/GameMount";

export const metadata: Metadata = {
  title: "Ashvale — a browser RPG",
  description:
    "A RuneScape-inspired browser RPG: click to walk, train ten skills, mine and smith your own gear, and cook for the village feast.",
};

export default function GamePage() {
  return (
    <div className="bg-[#1B140E] py-8">
      <div className="mx-auto max-w-6xl px-4">
        <header className="mb-5">
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl text-[#F2E8D5]">Ashvale</h1>
          <p className="mt-1 max-w-2xl text-sm text-[#B9A78A]">
            A small tribute to the classic browser MMOs. Click to walk, right click anything for its options, and
            train ten skills. Your character is saved in this browser as you play.
          </p>
        </header>

        <GameMount />

        <section className="mt-6 grid gap-4 text-[13px] text-[#B9A78A] sm:grid-cols-3">
          <div>
            <h2 className="mb-1 font-semibold text-[#F2E8D5]">Getting started</h2>
            <p>
              You begin at the crossroads with an axe, a pickaxe, a net and a tinderbox. Chop the trees to the
              north west, fish the lake shore, and sell what you gather at the general store.
            </p>
          </div>
          <div>
            <h2 className="mb-1 font-semibold text-[#F2E8D5]">Getting stronger</h2>
            <p>
              Mine copper and tin in the south east, smelt bronze bars at the furnace, then hammer them into gear at
              the anvil. Chickens and cows are safe practice; the goblins in the south hit back.
            </p>
          </div>
          <div>
            <h2 className="mb-1 font-semibold text-[#F2E8D5]">Controls</h2>
            <p>
              Left click to act, right click for every option, <kbd>Esc</kbd> to stop, <kbd>R</kbd> to toggle
              running. Type <code>/help</code> in the chat box for commands.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
