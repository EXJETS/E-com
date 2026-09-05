package com.exjets.aetheria.world;

import com.exjets.aetheria.npc.Npc;
import com.exjets.aetheria.npc.NpcRegistry;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.UncheckedIOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

/**
 * Reads a map file: a metadata block, a grid of terrain symbols, a matching grid of
 * scenery symbols and a list of npc spawns.
 */
public final class WorldLoader {

    private WorldLoader() {
    }

    public static World load(String resourcePath) {
        try (InputStream stream = WorldLoader.class.getResourceAsStream(resourcePath)) {
            if (stream == null) {
                throw new IllegalArgumentException("Map not found on the classpath: " + resourcePath);
            }
            return parse(new BufferedReader(new InputStreamReader(stream, StandardCharsets.UTF_8)));
        } catch (IOException e) {
            throw new UncheckedIOException("Could not read map " + resourcePath, e);
        }
    }

    static World parse(BufferedReader reader) throws IOException {
        String name = "Unnamed";
        int width = 0;
        int height = 0;
        Position spawn = new Position(0, 0);
        List<String> tileRows = new ArrayList<>();
        List<String> objectRows = new ArrayList<>();
        List<String> npcRows = new ArrayList<>();

        String section = "";
        String line;
        while ((line = reader.readLine()) != null) {
            if (line.isBlank()) {
                continue;
            }
            if (line.startsWith("[") && line.endsWith("]")) {
                section = line.substring(1, line.length() - 1);
                continue;
            }
            switch (section) {
                case "meta" -> {
                    String[] parts = line.split("=", 2);
                    switch (parts[0].trim()) {
                        case "name" -> name = parts[1].trim();
                        case "width" -> width = Integer.parseInt(parts[1].trim());
                        case "height" -> height = Integer.parseInt(parts[1].trim());
                        case "spawn" -> spawn = Position.parse(parts[1].trim());
                        default -> {
                        }
                    }
                }
                case "tiles" -> tileRows.add(line);
                case "objects" -> objectRows.add(line);
                case "npcs" -> npcRows.add(line);
                default -> {
                }
            }
        }
        if (width <= 0 || height <= 0) {
            throw new IllegalStateException("Map is missing its width or height");
        }
        if (tileRows.size() < height) {
            throw new IllegalStateException("Map declares " + height + " rows but has " + tileRows.size());
        }

        TileType[][] tiles = new TileType[height][width];
        for (int y = 0; y < height; y++) {
            String row = tileRows.get(y);
            for (int x = 0; x < width; x++) {
                char symbol = x < row.length() ? row.charAt(x) : '.';
                tiles[y][x] = TileType.fromSymbol(symbol);
            }
        }
        World world = new World(name, width, height, tiles, spawn);

        for (int y = 0; y < Math.min(height, objectRows.size()); y++) {
            String row = objectRows.get(y);
            for (int x = 0; x < width && x < row.length(); x++) {
                ObjectType type = ObjectType.fromSymbol(row.charAt(x));
                if (type == null) {
                    continue;
                }
                Position position = new Position(x, y);
                // Scenery that drifted onto a wall or into the water during map authoring is
                // dropped, except for fishing spots which belong on the water.
                boolean onWater = tiles[y][x] == TileType.WATER;
                boolean fishing = type == ObjectType.SHRIMP_SPOT || type == ObjectType.TROUT_SPOT;
                if (fishing != onWater) {
                    continue;
                }
                if (!fishing && !tiles[y][x].walkable()) {
                    continue;
                }
                world.addObject(new WorldObject(type, position));
            }
        }

        for (String row : npcRows) {
            String[] parts = row.split(",");
            if (parts.length < 3) {
                continue;
            }
            int x = Integer.parseInt(parts[0].trim());
            int y = Integer.parseInt(parts[1].trim());
            String key = parts[2].trim();
            int radius = parts.length > 3 ? Integer.parseInt(parts[3].trim()) : 3;
            world.addNpc(new Npc(NpcRegistry.get(key), new Position(x, y), radius));
        }
        return world;
    }
}
