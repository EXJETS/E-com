package com.exjets.aetheria.save;

import com.exjets.aetheria.combat.AttackStyle;
import com.exjets.aetheria.core.EquipSlot;
import com.exjets.aetheria.core.Inventory;
import com.exjets.aetheria.core.ItemRegistry;
import com.exjets.aetheria.core.Player;
import com.exjets.aetheria.core.SkillType;
import com.exjets.aetheria.world.Position;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Saves a character to a small key/value text file, so a save can be read, diffed
 * and hand edited without any serialization library.
 */
public final class SaveManager {

    private static final String VERSION = "1";

    private SaveManager() {
    }

    public static Path defaultSavePath() {
        return Paths.get(System.getProperty("user.home"), ".aetheria", "character.save");
    }

    public static void save(Player player, Path path) {
        List<String> lines = new ArrayList<>();
        lines.add("version=" + VERSION);
        lines.add("name=" + player.name());
        lines.add("position=" + player.position());
        lines.add("hitpoints=" + player.skills().currentHitpoints());
        lines.add("runEnergy=" + player.runEnergy());
        lines.add("running=" + player.runToggled());
        lines.add("attackStyle=" + player.attackStyle().name());
        lines.add("questStage=" + player.questStage());
        lines.add("deaths=" + player.deaths());
        for (SkillType skill : SkillType.values()) {
            lines.add("xp." + skill.name() + "=" + player.skills().xp(skill));
        }
        for (int i = 0; i < Inventory.CAPACITY; i++) {
            Inventory.Slot slot = player.inventory().slot(i);
            if (slot != null) {
                lines.add("inventory." + i + "=" + slot.id + ":" + slot.count);
            }
        }
        for (Map.Entry<EquipSlot, String> worn : player.equipment().all().entrySet()) {
            lines.add("equipment." + worn.getKey().name() + "=" + worn.getValue());
        }
        for (Map.Entry<String, Integer> entry : player.bank().contents().entrySet()) {
            lines.add("bank." + entry.getKey() + "=" + entry.getValue());
        }
        try {
            if (path.getParent() != null) {
                Files.createDirectories(path.getParent());
            }
            Files.write(path, lines, StandardCharsets.UTF_8);
        } catch (IOException e) {
            throw new UncheckedIOException("Could not write save file " + path, e);
        }
    }

    public static boolean saveExists(Path path) {
        return Files.isRegularFile(path);
    }

    /** Loads a character in place, ignoring any entries the current build no longer knows about. */
    public static void load(Player player, Path path) {
        Map<String, String> values = new LinkedHashMap<>();
        try {
            for (String line : Files.readAllLines(path, StandardCharsets.UTF_8)) {
                int split = line.indexOf('=');
                if (split > 0) {
                    values.put(line.substring(0, split).trim(), line.substring(split + 1).trim());
                }
            }
        } catch (IOException e) {
            throw new UncheckedIOException("Could not read save file " + path, e);
        }

        player.setName(values.getOrDefault("name", player.name()));
        if (values.containsKey("position")) {
            player.setPosition(Position.parse(values.get("position")));
        }
        player.inventory().clear();
        player.equipment().clear();
        player.bank().clear();

        for (Map.Entry<String, String> entry : values.entrySet()) {
            String key = entry.getKey();
            String value = entry.getValue();
            if (key.startsWith("xp.")) {
                SkillType skill = parseSkill(key.substring(3));
                if (skill != null) {
                    player.skills().setXp(skill, Integer.parseInt(value));
                }
            } else if (key.startsWith("inventory.")) {
                String[] parts = value.split(":");
                if (ItemRegistry.exists(parts[0])) {
                    player.inventory().setSlot(Integer.parseInt(key.substring(10)), parts[0],
                            Integer.parseInt(parts[1]));
                }
            } else if (key.startsWith("equipment.")) {
                EquipSlot slot = parseEquipSlot(key.substring(10));
                if (slot != null && ItemRegistry.exists(value)) {
                    player.equipment().equip(value);
                }
            } else if (key.startsWith("bank.")) {
                String itemId = key.substring(5);
                if (ItemRegistry.exists(itemId)) {
                    player.bank().deposit(itemId, Integer.parseInt(value));
                }
            }
        }
        player.skills().setCurrentHitpoints(Integer.parseInt(
                values.getOrDefault("hitpoints", String.valueOf(player.skills().maxHitpoints()))));
        player.setRunEnergy(Integer.parseInt(values.getOrDefault("runEnergy", "100")));
        player.setRunning(Boolean.parseBoolean(values.getOrDefault("running", "true")));
        player.setQuestStage(Integer.parseInt(values.getOrDefault("questStage", "0")));
        try {
            player.setAttackStyle(AttackStyle.valueOf(values.getOrDefault("attackStyle", "AGGRESSIVE")));
        } catch (IllegalArgumentException ignored) {
            player.setAttackStyle(AttackStyle.AGGRESSIVE);
        }
    }

    private static SkillType parseSkill(String name) {
        try {
            return SkillType.valueOf(name);
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    private static EquipSlot parseEquipSlot(String name) {
        try {
            return EquipSlot.valueOf(name);
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}
