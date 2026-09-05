"use client";

import { useEffect, useRef } from "react";
import { ItemDef, itemDef } from "@/game/core/items";
import { drawItemIcon } from "@/game/ui/render";

/** Draws an item with the same brush the world canvas uses, so panels and ground match. */
export default function ItemIcon({ id, size = 28 }: { id: string; size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ratio = window.devicePixelRatio || 1;
    canvas.width = size * ratio;
    canvas.height = size * ratio;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(ratio, ratio);
    ctx.clearRect(0, 0, size, size);
    const def: ItemDef = itemDef(id);
    drawItemIcon(ctx, def, 0, 0, size);
  }, [id, size]);

  return <canvas ref={canvasRef} style={{ width: size, height: size }} aria-hidden />;
}
