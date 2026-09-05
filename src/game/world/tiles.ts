export type TileType = "grass" | "dirt" | "road" | "sand" | "floor" | "water" | "wall" | "fence";

export const TILE_INFO: Record<TileType, { symbol: string; name: string; walkable: boolean; color: string }> = {
  grass: { symbol: ".", name: "Grass", walkable: true, color: "#4C7A34" },
  dirt: { symbol: ",", name: "Dirt", walkable: true, color: "#7A6242" },
  road: { symbol: "_", name: "Road", walkable: true, color: "#9B8B6A" },
  sand: { symbol: "s", name: "Sand", walkable: true, color: "#C8B681" },
  floor: { symbol: "=", name: "Floor", walkable: true, color: "#6E5E4A" },
  water: { symbol: "~", name: "Water", walkable: false, color: "#2E6C8E" },
  wall: { symbol: "#", name: "Wall", walkable: false, color: "#5B5651" },
  fence: { symbol: "x", name: "Fence", walkable: false, color: "#6B4F2A" },
};

const BY_SYMBOL = new Map<string, TileType>(
  (Object.keys(TILE_INFO) as TileType[]).map((tile) => [TILE_INFO[tile].symbol, tile]),
);

export function tileFromSymbol(symbol: string): TileType {
  return BY_SYMBOL.get(symbol) ?? "grass";
}
