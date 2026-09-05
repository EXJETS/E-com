export interface Position {
  x: number;
  y: number;
}

export function pos(x: number, y: number): Position {
  return { x, y };
}

export function posKey(position: Position): string {
  return `${position.x},${position.y}`;
}

export function parsePosition(text: string): Position {
  const [x, y] = text.split(",").map((part) => Number.parseInt(part.trim(), 10));
  return { x, y };
}

export function samePosition(a: Position, b: Position): boolean {
  return a.x === b.x && a.y === b.y;
}

/** Chebyshev distance, which is how many diagonal steps apart two tiles are. */
export function distance(a: Position, b: Position): number {
  return Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
}

export function translate(position: Position, dx: number, dy: number): Position {
  return { x: position.x + dx, y: position.y + dy };
}
