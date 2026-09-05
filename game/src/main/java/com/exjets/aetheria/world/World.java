package com.exjets.aetheria.world;

import com.exjets.aetheria.npc.Npc;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

/** The tile grid plus everything standing on it. */
public class World {

    private final String name;
    private final int width;
    private final int height;
    private final TileType[][] tiles;
    private final Map<Position, WorldObject> objects = new HashMap<>();
    private final List<Npc> npcs = new ArrayList<>();
    private final List<GroundItem> groundItems = new ArrayList<>();
    private final Position spawn;

    public World(String name, int width, int height, TileType[][] tiles, Position spawn) {
        this.name = name;
        this.width = width;
        this.height = height;
        this.tiles = tiles;
        this.spawn = spawn;
    }

    public String name() {
        return name;
    }

    public int width() {
        return width;
    }

    public int height() {
        return height;
    }

    public Position spawn() {
        return spawn;
    }

    public boolean inBounds(int x, int y) {
        return x >= 0 && y >= 0 && x < width && y < height;
    }

    public TileType tile(int x, int y) {
        return inBounds(x, y) ? tiles[y][x] : TileType.WALL;
    }

    public TileType tile(Position position) {
        return tile(position.x(), position.y());
    }

    public boolean isWalkable(int x, int y) {
        if (!inBounds(x, y) || !tiles[y][x].walkable()) {
            return false;
        }
        WorldObject object = objects.get(new Position(x, y));
        return object == null || !object.blocksMovement();
    }

    public boolean isWalkable(Position position) {
        return isWalkable(position.x(), position.y());
    }

    public void addObject(WorldObject object) {
        objects.put(object.position(), object);
    }

    public void removeObject(Position position) {
        objects.remove(position);
    }

    public WorldObject objectAt(Position position) {
        return objects.get(position);
    }

    public Map<Position, WorldObject> objects() {
        return objects;
    }

    public List<Npc> npcs() {
        return npcs;
    }

    public void addNpc(Npc npc) {
        npcs.add(npc);
    }

    public Npc npcAt(Position position) {
        for (Npc npc : npcs) {
            if (npc.isVisible() && npc.position().equals(position)) {
                return npc;
            }
        }
        return null;
    }

    public List<GroundItem> groundItems() {
        return groundItems;
    }

    public void addGroundItem(GroundItem item) {
        groundItems.add(item);
    }

    public GroundItem groundItemAt(Position position) {
        for (int i = groundItems.size() - 1; i >= 0; i--) {
            if (groundItems.get(i).position().equals(position)) {
                return groundItems.get(i);
            }
        }
        return null;
    }

    public void removeGroundItem(GroundItem item) {
        groundItems.remove(item);
    }

    /** Advances respawn timers, burns down fires and despawns dropped items. */
    public void tick() {
        Iterator<Map.Entry<Position, WorldObject>> objectIterator = objects.entrySet().iterator();
        while (objectIterator.hasNext()) {
            if (!objectIterator.next().getValue().tick()) {
                objectIterator.remove();
            }
        }
        groundItems.removeIf(item -> !item.tick());
    }

    /** The nearest walkable tile to {@code target}, used when the destination itself is blocked. */
    public Position nearestWalkable(Position target, int maxRadius) {
        if (isWalkable(target)) {
            return target;
        }
        for (int radius = 1; radius <= maxRadius; radius++) {
            for (int dy = -radius; dy <= radius; dy++) {
                for (int dx = -radius; dx <= radius; dx++) {
                    if (Math.max(Math.abs(dx), Math.abs(dy)) != radius) {
                        continue;
                    }
                    Position candidate = target.translate(dx, dy);
                    if (isWalkable(candidate)) {
                        return candidate;
                    }
                }
            }
        }
        return null;
    }
}
