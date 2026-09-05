import { Player } from "./core/player";
import { ASHVALE_MAP } from "./data/map";
import { GameEngine } from "./engine/engine";
import { loadWorld } from "./world/loader";

export function giveStarterKit(player: Player): void {
  player.inventory.add("bronze_axe", 1);
  player.inventory.add("bronze_pickaxe", 1);
  player.inventory.add("small_net", 1);
  player.inventory.add("tinderbox", 1);
  player.inventory.add("shrimp", 3);
  player.inventory.add("coins", 50);
}

/** Builds a fresh world, player and engine. */
export function createGame(random: () => number = Math.random): GameEngine {
  const world = loadWorld(ASHVALE_MAP);
  const player = new Player(world.spawn);
  return new GameEngine(world, player, random);
}
