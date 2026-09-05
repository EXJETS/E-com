"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

export default function Accordion({
  items,
  defaultOpen = 0,
}: {
  items: { q: string; a: string }[];
  defaultOpen?: number | null;
}) {
  const [open, setOpen] = useState<number | null>(defaultOpen);

  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q}>
            <h3>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${i}`}
                className="flex w-full items-start justify-between gap-6 py-5 text-left"
              >
                <span className="text-[16px] font-semibold text-ink">{item.q}</span>
                <Plus
                  size={19}
                  className={`mt-0.5 shrink-0 text-cool-500 transition-transform duration-200 ${
                    isOpen ? "rotate-45" : ""
                  }`}
                />
              </button>
            </h3>
            <div
              id={`faq-panel-${i}`}
              hidden={!isOpen}
              className="pb-6 pr-10 text-[15px] leading-relaxed text-body"
            >
              {item.a}
            </div>
          </div>
        );
      })}
    </div>
  );
}
