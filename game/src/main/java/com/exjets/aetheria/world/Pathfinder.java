package com.exjets.aetheria.world;

import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Deque;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.PriorityQueue;
import java.util.Set;

/** A* over the tile grid. Movement is eight directional but never cuts a blocked corner. */
public final class Pathfinder {

    private static final int MAX_NODES = 20_000;
    private static final int[][] DIRECTIONS = {
            {0, -1}, {1, 0}, {0, 1}, {-1, 0}, {1, -1}, {1, 1}, {-1, 1}, {-1, -1}
    };

    private Pathfinder() {
    }

    /**
     * Finds a walking route.
     *
     * @param stopAdjacent when true the path ends on a tile next to the target, which is how
     *                     the player reaches trees, rocks and other blocked scenery
     * @return the steps to walk, excluding the starting tile, or an empty deque if unreachable
     */
    public static Deque<Position> findPath(World world, Position start, Position target, boolean stopAdjacent) {
        if (start.equals(target)) {
            return new ArrayDeque<>();
        }
        Set<Position> goals = new HashSet<>();
        if (stopAdjacent) {
            for (int[] direction : DIRECTIONS) {
                Position candidate = target.translate(direction[0], direction[1]);
                if (world.isWalkable(candidate)) {
                    goals.add(candidate);
                }
            }
            if (world.isWalkable(target)) {
                goals.add(target);
            }
        } else if (world.isWalkable(target)) {
            goals.add(target);
        } else {
            Position nearest = world.nearestWalkable(target, 4);
            if (nearest != null) {
                goals.add(nearest);
            }
        }
        if (goals.isEmpty()) {
            return new ArrayDeque<>();
        }
        if (goals.contains(start)) {
            return new ArrayDeque<>();
        }

        Map<Position, Position> cameFrom = new HashMap<>();
        Map<Position, Integer> costSoFar = new HashMap<>();
        PriorityQueue<Node> frontier = new PriorityQueue<>();
        frontier.add(new Node(start, 0));
        costSoFar.put(start, 0);

        int expanded = 0;
        Position found = null;
        while (!frontier.isEmpty() && expanded++ < MAX_NODES) {
            Position current = frontier.poll().position;
            if (goals.contains(current)) {
                found = current;
                break;
            }
            for (int[] direction : DIRECTIONS) {
                int dx = direction[0];
                int dy = direction[1];
                Position next = current.translate(dx, dy);
                if (!world.isWalkable(next)) {
                    continue;
                }
                boolean diagonal = dx != 0 && dy != 0;
                if (diagonal && (!world.isWalkable(current.translate(dx, 0))
                        || !world.isWalkable(current.translate(0, dy)))) {
                    continue;
                }
                int newCost = costSoFar.get(current) + (diagonal ? 14 : 10);
                Integer previous = costSoFar.get(next);
                if (previous == null || newCost < previous) {
                    costSoFar.put(next, newCost);
                    cameFrom.put(next, current);
                    frontier.add(new Node(next, newCost + 10 * next.distanceTo(target)));
                }
            }
        }
        if (found == null) {
            return new ArrayDeque<>();
        }
        List<Position> steps = new ArrayList<>();
        for (Position at = found; !at.equals(start); at = cameFrom.get(at)) {
            steps.add(at);
        }
        Collections.reverse(steps);
        return new ArrayDeque<>(steps);
    }

    private record Node(Position position, int priority) implements Comparable<Node> {
        @Override
        public int compareTo(Node other) {
            return Integer.compare(priority, other.priority);
        }
    }
}
