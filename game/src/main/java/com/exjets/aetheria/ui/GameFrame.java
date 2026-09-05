package com.exjets.aetheria.ui;

import com.exjets.aetheria.core.SkillType;
import com.exjets.aetheria.game.GameEngine;
import com.exjets.aetheria.game.Quest;
import com.exjets.aetheria.npc.Npc;
import com.exjets.aetheria.save.SaveManager;
import com.exjets.aetheria.world.Position;

import javax.swing.AbstractAction;
import javax.swing.JComponent;
import javax.swing.JFrame;
import javax.swing.JMenu;
import javax.swing.JMenuBar;
import javax.swing.JMenuItem;
import javax.swing.JOptionPane;
import javax.swing.KeyStroke;
import javax.swing.Timer;
import java.awt.BorderLayout;
import java.awt.event.ActionEvent;
import java.awt.event.KeyEvent;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;
import java.nio.file.Path;
import java.util.List;

/** The client window: viewport, side panel, chatbox, menus and the game clock. */
public class GameFrame extends JFrame implements GameEngine.Listener {

    private static final int AUTOSAVE_INTERVAL_TICKS = 250;

    private final GameEngine engine;
    private final Path savePath;
    private final WorldPanel worldPanel;
    private final SidePanel sidePanel;
    private final ChatPanel chatPanel;
    private final Timer timer;

    public GameFrame(GameEngine engine, Path savePath) {
        super("Ashvale - a RuneScape inspired adventure");
        this.engine = engine;
        this.savePath = savePath;
        this.worldPanel = new WorldPanel(engine);
        this.sidePanel = new SidePanel(engine);
        this.chatPanel = new ChatPanel(this::runCommand);

        engine.setListener(this);
        engine.log().onMessage(chatPanel::append);
        engine.log().messages().forEach(chatPanel::append);

        setDefaultCloseOperation(DO_NOTHING_ON_CLOSE);
        setLayout(new BorderLayout());
        add(worldPanel, BorderLayout.CENTER);
        add(sidePanel, BorderLayout.EAST);
        add(chatPanel, BorderLayout.SOUTH);
        setJMenuBar(buildMenuBar());
        installKeyBindings();
        pack();
        setLocationRelativeTo(null);

        addWindowListener(new WindowAdapter() {
            @Override
            public void windowClosing(WindowEvent event) {
                quit();
            }
        });

        timer = new Timer(GameEngine.TICK_MS, event -> {
            engine.tick();
            if (engine.tickCount() % AUTOSAVE_INTERVAL_TICKS == 0) {
                SaveManager.save(engine.player(), savePath);
            }
            worldPanel.repaint();
            sidePanel.repaint();
        });
        timer.start();
    }

    private JMenuBar buildMenuBar() {
        JMenuBar bar = new JMenuBar();
        bar.setBackground(Theme.CHROME_LIGHT);
        JMenu game = new JMenu("Game");
        game.setForeground(Theme.TEXT);
        game.add(menuItem("Save", this::save));
        game.add(menuItem("Load", this::load));
        game.addSeparator();
        game.add(menuItem("Quit", this::quit));
        JMenu help = new JMenu("Help");
        help.setForeground(Theme.TEXT);
        help.add(menuItem("Controls", () -> JOptionPane.showMessageDialog(this, """
                Left click    walk, gather, attack or talk
                Right click   every option for what is under the cursor
                Backpack      left click to eat or equip, right click for more
                Esc           stop what you are doing
                R             toggle running
                Ctrl+S        save,  Ctrl+L  load
                Chat commands /help, /save, /load, /where, /stop, /run, /style
                """, "Controls", JOptionPane.INFORMATION_MESSAGE)));
        help.add(menuItem("About", () -> JOptionPane.showMessageDialog(this, """
                Ashvale is a small tribute to the classic browser MMOs:
                click to walk, train ten skills, bank your loot, smith
                your own gear and cook for the village feast.
                """, "About Ashvale", JOptionPane.INFORMATION_MESSAGE)));
        bar.add(game);
        bar.add(help);
        return bar;
    }

    private JMenuItem menuItem(String label, Runnable onClick) {
        JMenuItem item = new JMenuItem(label);
        item.addActionListener(event -> onClick.run());
        return item;
    }

    private void installKeyBindings() {
        bind("ESCAPE", () -> {
            engine.stopAction();
            engine.player().clearPath();
            engine.message("You stop what you were doing.");
            worldPanel.requestFocusInWindow();
        });
        bind("pressed R", () -> {
            engine.player().setRunning(!engine.player().runToggled());
            engine.message("Running is now " + (engine.player().runToggled() ? "on" : "off") + ".");
        });
        bind("control S", this::save);
        bind("control L", this::load);
        bind("ENTER", chatPanel::focusInput);
    }

    private void bind(String keyStroke, Runnable action) {
        String name = "action-" + keyStroke;
        boolean plainLetter = keyStroke.matches("(pressed )?[A-Z]");
        getRootPane().getInputMap(JComponent.WHEN_IN_FOCUSED_WINDOW)
                .put(KeyStroke.getKeyStroke(keyStroke), name);
        getRootPane().getActionMap().put(name, new AbstractAction() {
            @Override
            public void actionPerformed(ActionEvent event) {
                // Letters are also perfectly good chat, so leave them alone while typing.
                if (plainLetter && chatPanel.isTyping()) {
                    return;
                }
                action.run();
                worldPanel.repaint();
                sidePanel.repaint();
            }
        });
    }

    private void runCommand(String text) {
        if (!text.startsWith("/")) {
            engine.message(engine.player().name() + ": " + text);
            return;
        }
        String[] parts = text.substring(1).split("\\s+");
        switch (parts[0].toLowerCase()) {
            case "help" -> engine.message("Commands: /save /load /where /stop /run /style /quest");
            case "save" -> save();
            case "load" -> load();
            case "where" -> engine.message("You are standing at " + engine.player().position() + ".");
            case "stop" -> {
                engine.stopAction();
                engine.player().clearPath();
                engine.message("You stop what you were doing.");
            }
            case "run" -> {
                engine.player().setRunning(!engine.player().runToggled());
                engine.message("Running is now " + (engine.player().runToggled() ? "on" : "off") + ".");
            }
            case "style" -> {
                engine.player().setAttackStyle(engine.player().attackStyle().next());
                engine.message("Attack style: " + engine.player().attackStyle().displayName() + ".");
            }
            case "quest" -> engine.message(Quest.progressText(engine.player().questStage()));
            default -> engine.message("Unknown command. Try /help.");
        }
    }

    private void save() {
        SaveManager.save(engine.player(), savePath);
        engine.message("Character saved to " + savePath + ".");
    }

    private void load() {
        if (!SaveManager.saveExists(savePath)) {
            engine.message("There is no save file at " + savePath + ".");
            return;
        }
        SaveManager.load(engine.player(), savePath);
        engine.stopAction();
        engine.player().clearPath();
        engine.message("Character loaded.");
    }

    private void quit() {
        timer.stop();
        SaveManager.save(engine.player(), savePath);
        dispose();
        System.exit(0);
    }

    // ------------------------------------------------------------------ engine callbacks

    @Override
    public void onOpenBank() {
        Dialogs.bank(this, engine, this::repaintPanels);
    }

    @Override
    public void onOpenShop(Npc npc) {
        Dialogs.shop(this, engine, npc, this::repaintPanels);
    }

    @Override
    public void onOpenSmelting(Position furnace) {
        Dialogs.smelting(this, engine, furnace);
    }

    @Override
    public void onOpenSmithing(Position anvil) {
        Dialogs.smithing(this, engine, anvil);
    }

    @Override
    public void onOpenCooking(Position range) {
        Dialogs.cooking(this, engine, range);
    }

    @Override
    public void onDialogue(Npc npc) {
        List<String> lines = npc.def().key().equals("aldric")
                ? engine.talkToAldric()
                : List.of(npc.def().dialogue());
        Dialogs.dialogue(this, npc.name(), lines.isEmpty() ? List.of("...") : lines);
    }

    @Override
    public void onLevelUp(SkillType skill, int level) {
        worldPanel.repaint();
        sidePanel.repaint();
    }

    @Override
    public void onDeath() {
        JOptionPane.showMessageDialog(this,
                "You were defeated and woke up back in Ashvale.\nYour belongings are untouched.",
                "Oh dear, you are dead!", JOptionPane.WARNING_MESSAGE);
    }

    private void repaintPanels() {
        worldPanel.repaint();
        sidePanel.repaint();
    }
}
