package com.exjets.aetheria;

import com.exjets.aetheria.core.Player;
import com.exjets.aetheria.game.GameEngine;
import com.exjets.aetheria.game.Simulation;
import com.exjets.aetheria.ui.ChatPanel;
import com.exjets.aetheria.ui.SidePanel;
import com.exjets.aetheria.ui.WorldPanel;
import com.exjets.aetheria.world.ObjectType;
import com.exjets.aetheria.world.World;
import com.exjets.aetheria.world.WorldLoader;

import javax.imageio.ImageIO;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.File;
import java.util.Random;

/**
 * Paints the client into a PNG without opening a window, which keeps the renderer
 * covered on headless machines and produces the screenshot used in the README.
 */
public final class ScreenshotTool {

    private ScreenshotTool() {
    }

    /** Swing only lays a container out once it is displayable, so do it by hand for the capture. */
    private static void layout(java.awt.Container container) {
        container.doLayout();
        for (java.awt.Component child : container.getComponents()) {
            if (child instanceof java.awt.Container nested) {
                layout(nested);
            }
        }
    }

    public static void main(String[] args) throws Exception {
        System.setProperty("java.awt.headless", "true");
        File output = new File(args.length > 0 ? args[0] : "screenshot.png");
        String viewpoint = args.length > 1 ? args[1] : "31,21";

        World world = WorldLoader.load("/maps/ashvale.map");
        Player player = new Player(world.spawn());
        player.setName("Adventurer");
        player.inventory().add("bronze_axe", 1);
        player.inventory().add("bronze_pickaxe", 1);
        player.inventory().add("small_net", 1);
        player.inventory().add("tinderbox", 1);
        player.inventory().add("coins", 1250);
        player.equipment().equip("bronze_sword");
        player.equipment().equip("bronze_platebody");
        GameEngine engine = new GameEngine(world, player, new Random(4));
        engine.message("Welcome to " + world.name() + ", " + player.name() + ".");
        Simulation.harvest(engine, ObjectType.TREE, 30);
        engine.player().setPosition(com.exjets.aetheria.world.Position.parse(viewpoint));
        Simulation.run(engine, 4);

        int worldWidth = 21 * 32;
        int worldHeight = 17 * 32;
        int sideWidth = 248;
        int chatHeight = 150;
        BufferedImage image = new BufferedImage(worldWidth + sideWidth, worldHeight + chatHeight,
                BufferedImage.TYPE_INT_RGB);
        Graphics2D g = image.createGraphics();

        WorldPanel worldPanel = new WorldPanel(engine);
        worldPanel.setSize(worldWidth, worldHeight);
        worldPanel.paint(g.create(0, 0, worldWidth, worldHeight));

        SidePanel sidePanel = new SidePanel(engine);
        sidePanel.setSize(sideWidth, worldHeight + chatHeight);
        sidePanel.paint(g.create(worldWidth, 0, sideWidth, worldHeight + chatHeight));

        ChatPanel chatPanel = new ChatPanel(command -> {
        });
        engine.log().messages().forEach(chatPanel::append);
        chatPanel.setSize(worldWidth, chatHeight);
        layout(chatPanel);
        chatPanel.paint(g.create(0, worldHeight, worldWidth, chatHeight));

        g.dispose();
        ImageIO.write(image, "png", output);
        System.out.println("Wrote " + output.getAbsolutePath() + " (" + image.getWidth()
                + "x" + image.getHeight() + ")");
    }
}
