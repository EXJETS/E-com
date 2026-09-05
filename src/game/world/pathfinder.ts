import { Position, distance, posKey, samePosition, translate } from "./position";
import { World } from "./world";

const MAX_NODES = 20_000;
const DIRECTIONS: [number, number][] = [
  [0, -1], [1, 0], [0, 1], [-1, 0], [1, -1], [1, 1], [-1, 1], [-1, -1],
];

/**
 * A* over the tile grid. Movement is eight directional but never cuts a blocked corner.
 *
 * @param stopAdjacent end on a tile next to the target, which is how the player reaches
 *                     trees, rocks and other blocked scenery
 * @returns the steps to walk, excluding the starting tile; empty when unreachable
 */
export function findPath(world: World, start: Position, target: Position, stopAdjacent: boolean): Position[] {
  if (samePosition(start, target)) return [];

  const goals = new Set<string>();
  if (stopAdjacent) {
    for (const [dx, dy] of DIRECTIONS) {
      const candidate = translate(target, dx, dy);
      if (world.isWalkable(candidate)) goals.add(posKey(candidate));
    }
    if (world.isWalkable(target)) goals.add(posKey(target));
  } else if (world.isWalkable(target)) {
    goals.add(posKey(target));
  } else {
    const nearest = world.nearestWalkable(target, 4);
    if (nearest) goals.add(posKey(nearest));
  }
  if (goals.size === 0 || goals.has(posKey(start))) return [];

  const cameFrom = new Map<string, Position>();
  const costSoFar = new Map<string, number>([[posKey(start), 0]]);
  const frontier: { position: Position; priority: number }[] = [{ position: start, priority: 0 }];

  let expanded = 0;
  let found: Position | null = null;
  while (frontier.length > 0 && expanded++ < MAX_NODES) {
    // A binary heap would be faster, but a region this size stays comfortably interactive.
    let bestIndex = 0;
    for (let i = 1; i < frontier.length; i++) {
      if (frontier[i].priority < frontier[bestIndex].priority) bestIndex = i;
    }
    const current = frontier.splice(bestIndex, 1)[0].position;
    if (goals.has(posKey(current))) {
      found = current;
      break;
    }
    for (const [dx, dy] of DIRECTIONS) {
      const next = translate(current, dx, dy);
      if (!world.isWalkable(next)) continue;
      const diagonal = dx !== 0 && dy !== 0;
      if (
        diagonal &&
        (!world.isWalkable(translate(current, dx, 0)) || !world.isWalkable(translate(current, 0, dy)))
      ) {
        continue;
      }
      const newCost = (costSoFar.get(posKey(current)) ?? 0) + (diagonal ? 14 : 10);
      const previous = costSoFar.get(posKey(next));
      if (previous === undefined || newCost < previous) {
        costSoFar.set(posKey(next), newCost);
        cameFrom.set(posKey(next), current);
        frontier.push({ position: next, priority: newCost + 10 * distance(next, target) });
      }
    }
  }
  if (!found) return [];

  const steps: Position[] = [];
  for (let at = found; !samePosition(at, start); at = cameFrom.get(posKey(at))!) {
    steps.push(at);
  }
  return steps.reverse();
}
