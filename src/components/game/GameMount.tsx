"use client";

import dynamic from "next/dynamic";

// The game owns a canvas, a clock and browser storage, so there is nothing useful to
// prerender: load it on the client only. `ssr: false` has to live in a client component.
const AshvaleGame = dynamic(() => import("./AshvaleGame"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[420px] items-center justify-center rounded-lg border border-[#6B5136] bg-[#2B2118] text-[#B9A78A] sm:h-[544px]">
      Loading Ashvale…
    </div>
  ),
});

export default function GameMount() {
  return <AshvaleGame />;
}
