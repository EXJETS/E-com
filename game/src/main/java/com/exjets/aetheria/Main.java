package com.exjets.aetheria;

import com.exjets.aetheria.core.Player;
import com.exjets.aetheria.game.GameEngine;
import com.exjets.aetheria.game.Simulation;
import com.exjets.aetheria.save.SaveManager;
import com.exjets.aetheria.ui.GameFrame;
import com.exjets.aetheria.world.World;
import com.exjets.aetheria.world.WorldLoader;

import javax.swing.SwingUtilities;
import javax.swing.UIManager;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * Entry point.
 *
 * <pre>
 *   java -cp build/classes com.exjets.aetheria.Main                 start the client
 *   java -cp build/classes com.exjets.aetheria.Main --headless 400  run a scripted demo
 *   java -cp build/classes com.exjets.aetheria.Main --save my.save  use another character file
 * </pre>
 */
public final class Main {

    private static final String MAP = "/maps/ashvale.map";

    private Main() {
    }

    public static void main(String[] args) {
        Path savePath = SaveManager.defaultSavePath();
        String name = "Adventurer";
        boolean headless = false;
        int headlessTicks = 400;

        for (int i = 0; i < args.length; i++) {
            switch (args[i]) {
                case "--headless" -> {
                    headless = true;
                    if (i + 1 < args.length && args[i + 1].matches("\\d+")) {
                        headlessTicks = Integer.parseInt(args[++i]);
                    }
                }
                case "--save" -> savePath = Paths.get(args[++i]);
                case "--name" -> name = args[++i];
                case "--help" -> {
                    System.out.println("""
                            Ashvale - a RuneScape inspired adventure
                              --headless [ticks]  run a scripted session with no window
                              --save <path>       character file to load and save (default ~/.aetheria)
                              --name <name>       name a brand new character
                            """);
                    return;
                }
                default -> System.err.println("Ignoring unknown option: " + args[i]);
            }
        }

        World world = WorldLoader.load(MAP);
        Player player = new Player(world.spawn());
        player.setName(name);
        boolean returning = SaveManager.saveExists(savePath);
        if (returning) {
            SaveManager.load(player, savePath);
        } else {
            giveStarterKit(player);
        }

        GameEngine engine = new GameEngine(world, player);
        engine.message("Welcome to " + world.name() + ", " + player.name() + ".");
        if (returning) {
            engine.message("Your character was restored from " + savePath + ".");
        } else {
            engine.message("Left click the world to walk. Right click anything for its options.");
            engine.message("You have been given an axe, a pickaxe, a net and a tinderbox.");
        }

        if (headless) {
            Simulation.demo(engine, headlessTicks);
            SaveManager.save(player, savePath);
            return;
        }

        Path characterFile = savePath;
        SwingUtilities.invokeLater(() -> {
            try {
                UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
            } catch (Exception ignored) {
                // The cross platform look and feel is a perfectly good fallback.
            }
            new GameFrame(engine, characterFile).setVisible(true);
        });
    }

    private static void giveStarterKit(Player player) {
        player.inventory().add("bronze_axe", 1);
        player.inventory().add("bronze_pickaxe", 1);
        player.inventory().add("small_net", 1);
        player.inventory().add("tinderbox", 1);
        player.inventory().add("shrimp", 3);
        player.inventory().add("coins", 50);
    }
}
