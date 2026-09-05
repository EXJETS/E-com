package com.exjets.aetheria.ui;

import com.exjets.aetheria.core.Inventory;
import com.exjets.aetheria.core.ItemDef;
import com.exjets.aetheria.core.ItemRegistry;
import com.exjets.aetheria.core.SkillType;
import com.exjets.aetheria.game.GameEngine;
import com.exjets.aetheria.game.ProcessAction;
import com.exjets.aetheria.game.Recipes;
import com.exjets.aetheria.game.Shop;
import com.exjets.aetheria.npc.Npc;
import com.exjets.aetheria.world.Position;

import javax.swing.BorderFactory;
import javax.swing.Box;
import javax.swing.BoxLayout;
import javax.swing.DefaultListCellRenderer;
import javax.swing.DefaultListModel;
import javax.swing.JButton;
import javax.swing.JDialog;
import javax.swing.JLabel;
import javax.swing.JList;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.ListSelectionModel;
import javax.swing.SwingConstants;
import java.awt.BorderLayout;
import java.awt.Component;
import java.awt.Dimension;
import java.awt.FlowLayout;
import java.awt.Frame;
import java.awt.GridLayout;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.BiConsumer;

/** The pop-up windows: bank, shop, crafting menus and npc conversations. */
public final class Dialogs {

    /** One row in a chooser: the id that is acted on, what the player reads, and whether it is usable. */
    public record Option(String id, String label, boolean enabled) {
    }

    private Dialogs() {
    }

    private static JDialog frame(Frame owner, String title, int width, int height) {
        JDialog dialog = new JDialog(owner, title, false);
        dialog.getContentPane().setBackground(Theme.CHROME);
        dialog.setSize(width, height);
        dialog.setLocationRelativeTo(owner);
        return dialog;
    }

    private static JButton button(String text, Runnable onClick) {
        JButton button = new JButton(text);
        button.setBackground(Theme.CHROME_LIGHT);
        button.setForeground(Theme.TEXT);
        button.setFocusPainted(false);
        button.setFont(Theme.UI_BOLD);
        button.addActionListener(event -> onClick.run());
        return button;
    }

    private static JLabel label(String text) {
        JLabel label = new JLabel(text);
        label.setForeground(Theme.TEXT_DIM);
        label.setFont(Theme.UI_BOLD);
        label.setBorder(BorderFactory.createEmptyBorder(6, 8, 4, 8));
        return label;
    }

    private static <T> JList<T> styledList(DefaultListModel<T> model) {
        JList<T> list = new JList<>(model);
        list.setBackground(Theme.SLOT);
        list.setForeground(Theme.TEXT);
        list.setSelectionBackground(Theme.BORDER);
        list.setSelectionForeground(Theme.TEXT);
        list.setFont(Theme.UI);
        list.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);
        return list;
    }

    // ------------------------------------------------------------------ bank

    public static JDialog bank(Frame owner, GameEngine engine, Runnable onChange) {
        JDialog dialog = frame(owner, "Bank of Ashvale", 560, 420);
        DefaultListModel<String> bankModel = new DefaultListModel<>();
        DefaultListModel<String> backpackModel = new DefaultListModel<>();
        List<String> bankIds = new ArrayList<>();
        List<Integer> backpackSlots = new ArrayList<>();
        JList<String> bankList = styledList(bankModel);
        JList<String> backpackList = styledList(backpackModel);

        Runnable refresh = () -> {
            bankModel.clear();
            bankIds.clear();
            for (Map.Entry<String, Integer> entry : engine.player().bank().contents().entrySet()) {
                bankIds.add(entry.getKey());
                bankModel.addElement(ItemRegistry.nameOf(entry.getKey()) + "   x " + entry.getValue());
            }
            if (bankModel.isEmpty()) {
                bankModel.addElement("Your bank is empty.");
            }
            backpackModel.clear();
            backpackSlots.clear();
            Inventory inventory = engine.player().inventory();
            for (int i = 0; i < Inventory.CAPACITY; i++) {
                Inventory.Slot slot = inventory.slot(i);
                if (slot != null) {
                    backpackSlots.add(i);
                    backpackModel.addElement(ItemRegistry.nameOf(slot.id)
                            + (slot.count > 1 ? "   x " + slot.count : ""));
                }
            }
            onChange.run();
        };
        refresh.run();

        JPanel bankSide = new JPanel(new BorderLayout());
        bankSide.setBackground(Theme.CHROME);
        bankSide.add(label("Bank"), BorderLayout.NORTH);
        bankSide.add(new JScrollPane(bankList), BorderLayout.CENTER);
        JPanel bankButtons = new JPanel(new GridLayout(1, 3, 4, 4));
        bankButtons.setBackground(Theme.CHROME);
        for (int amount : new int[]{1, 10, Integer.MAX_VALUE}) {
            String text = amount == Integer.MAX_VALUE ? "Withdraw all" : "Withdraw " + amount;
            bankButtons.add(button(text, () -> {
                int index = bankList.getSelectedIndex();
                if (index >= 0 && index < bankIds.size()) {
                    engine.bankWithdraw(bankIds.get(index), amount);
                    refresh.run();
                }
            }));
        }
        bankSide.add(bankButtons, BorderLayout.SOUTH);

        JPanel backpackSide = new JPanel(new BorderLayout());
        backpackSide.setBackground(Theme.CHROME);
        backpackSide.add(label("Backpack"), BorderLayout.NORTH);
        backpackSide.add(new JScrollPane(backpackList), BorderLayout.CENTER);
        JPanel backpackButtons = new JPanel(new GridLayout(1, 3, 4, 4));
        backpackButtons.setBackground(Theme.CHROME);
        for (int amount : new int[]{1, 10, Integer.MAX_VALUE}) {
            String text = amount == Integer.MAX_VALUE ? "Deposit all" : "Deposit " + amount;
            backpackButtons.add(button(text, () -> {
                int index = backpackList.getSelectedIndex();
                if (index >= 0 && index < backpackSlots.size()) {
                    engine.bankDeposit(backpackSlots.get(index), amount);
                    refresh.run();
                }
            }));
        }
        backpackSide.add(backpackButtons, BorderLayout.SOUTH);

        JPanel content = new JPanel(new GridLayout(1, 2, 8, 8));
        content.setBackground(Theme.CHROME);
        content.setBorder(BorderFactory.createEmptyBorder(8, 8, 8, 8));
        content.add(bankSide);
        content.add(backpackSide);
        dialog.add(content, BorderLayout.CENTER);
        JPanel footer = new JPanel(new FlowLayout(FlowLayout.RIGHT));
        footer.setBackground(Theme.CHROME);
        footer.add(button("Deposit everything", () -> {
            engine.bankDepositAll();
            refresh.run();
        }));
        footer.add(button("Close", dialog::dispose));
        dialog.add(footer, BorderLayout.SOUTH);
        dialog.setVisible(true);
        return dialog;
    }

    // ------------------------------------------------------------------ shop

    public static JDialog shop(Frame owner, GameEngine engine, Npc keeper, Runnable onChange) {
        JDialog dialog = frame(owner, keeper.name() + "'s general store", 560, 420);
        DefaultListModel<String> stockModel = new DefaultListModel<>();
        DefaultListModel<String> backpackModel = new DefaultListModel<>();
        List<Integer> backpackSlots = new ArrayList<>();
        JList<String> stockList = styledList(stockModel);
        JList<String> backpackList = styledList(backpackModel);
        JLabel purse = label("");

        Runnable refresh = () -> {
            stockModel.clear();
            for (String id : Shop.STOCK) {
                stockModel.addElement(ItemRegistry.nameOf(id) + "   " + Shop.buyPrice(id) + " coins");
            }
            backpackModel.clear();
            backpackSlots.clear();
            Inventory inventory = engine.player().inventory();
            for (int i = 0; i < Inventory.CAPACITY; i++) {
                Inventory.Slot slot = inventory.slot(i);
                if (slot != null) {
                    backpackSlots.add(i);
                    backpackModel.addElement(ItemRegistry.nameOf(slot.id)
                            + (slot.count > 1 ? " x " + slot.count : "")
                            + "   sells for " + Shop.sellPrice(slot.id));
                }
            }
            purse.setText("You have " + engine.player().inventory().count("coins") + " coins");
            onChange.run();
        };
        refresh.run();

        JPanel stockSide = new JPanel(new BorderLayout());
        stockSide.setBackground(Theme.CHROME);
        stockSide.add(label("For sale"), BorderLayout.NORTH);
        stockSide.add(new JScrollPane(stockList), BorderLayout.CENTER);
        JPanel buyButtons = new JPanel(new GridLayout(1, 2, 4, 4));
        buyButtons.setBackground(Theme.CHROME);
        for (int amount : new int[]{1, 5}) {
            buyButtons.add(button("Buy " + amount, () -> {
                int index = stockList.getSelectedIndex();
                if (index >= 0) {
                    engine.buy(Shop.STOCK.get(index), amount);
                    refresh.run();
                }
            }));
        }
        stockSide.add(buyButtons, BorderLayout.SOUTH);

        JPanel sellSide = new JPanel(new BorderLayout());
        sellSide.setBackground(Theme.CHROME);
        sellSide.add(label("Your backpack"), BorderLayout.NORTH);
        sellSide.add(new JScrollPane(backpackList), BorderLayout.CENTER);
        JPanel sellButtons = new JPanel(new GridLayout(1, 2, 4, 4));
        sellButtons.setBackground(Theme.CHROME);
        sellButtons.add(button("Sell 1", () -> {
            int index = backpackList.getSelectedIndex();
            if (index >= 0 && index < backpackSlots.size()) {
                engine.sell(backpackSlots.get(index), 1);
                refresh.run();
            }
        }));
        sellButtons.add(button("Sell all", () -> {
            int index = backpackList.getSelectedIndex();
            if (index >= 0 && index < backpackSlots.size()) {
                engine.sell(backpackSlots.get(index), Integer.MAX_VALUE);
                refresh.run();
            }
        }));
        sellSide.add(sellButtons, BorderLayout.SOUTH);

        JPanel content = new JPanel(new GridLayout(1, 2, 8, 8));
        content.setBackground(Theme.CHROME);
        content.setBorder(BorderFactory.createEmptyBorder(8, 8, 8, 8));
        content.add(stockSide);
        content.add(sellSide);
        dialog.add(content, BorderLayout.CENTER);
        JPanel footer = new JPanel(new BorderLayout());
        footer.setBackground(Theme.CHROME);
        footer.add(purse, BorderLayout.WEST);
        JPanel right = new JPanel(new FlowLayout(FlowLayout.RIGHT));
        right.setBackground(Theme.CHROME);
        right.add(button("Close", dialog::dispose));
        footer.add(right, BorderLayout.EAST);
        dialog.add(footer, BorderLayout.SOUTH);
        dialog.setVisible(true);
        return dialog;
    }

    // ------------------------------------------------------------------ crafting choosers

    public static void chooser(Frame owner, String title, String hint, List<Option> options,
                               BiConsumer<String, Integer> onChoose) {
        JDialog dialog = frame(owner, title, 380, 360);
        DefaultListModel<String> model = new DefaultListModel<>();
        options.forEach(option -> model.addElement(option.label()));
        JList<String> list = styledList(model);
        list.setCellRenderer(new DefaultListCellRenderer() {
            @Override
            public Component getListCellRendererComponent(JList<?> jList, Object value, int index,
                                                          boolean selected, boolean focused) {
                Component component = super.getListCellRendererComponent(jList, value, index, selected, focused);
                component.setForeground(options.get(index).enabled() ? Theme.TEXT : Theme.TEXT_DIM);
                component.setBackground(selected ? Theme.BORDER : Theme.SLOT);
                setFont(Theme.UI);
                return component;
            }
        });
        if (!options.isEmpty()) {
            list.setSelectedIndex(0);
        }
        dialog.add(label(hint), BorderLayout.NORTH);
        dialog.add(new JScrollPane(list), BorderLayout.CENTER);
        JPanel buttons = new JPanel(new GridLayout(1, 4, 4, 4));
        buttons.setBackground(Theme.CHROME);
        for (int amount : new int[]{1, 5, 10, 28}) {
            buttons.add(button(amount == 28 ? "All" : "Make " + amount, () -> {
                int index = list.getSelectedIndex();
                if (index >= 0 && options.get(index).enabled()) {
                    onChoose.accept(options.get(index).id(), amount);
                    dialog.dispose();
                }
            }));
        }
        dialog.add(buttons, BorderLayout.SOUTH);
        dialog.setVisible(true);
    }

    public static void smelting(Frame owner, GameEngine engine, Position furnace) {
        List<Option> options = new ArrayList<>();
        for (Map.Entry<String, ProcessAction.Recipe> entry : Recipes.SMELTING.entrySet()) {
            ProcessAction.Recipe recipe = entry.getValue();
            boolean levelOk = engine.player().skills().level(SkillType.SMITHING) >= recipe.levelRequired();
            boolean hasOre = recipe.inputs().entrySet().stream()
                    .allMatch(input -> engine.player().inventory().contains(input.getKey(), input.getValue()));
            StringBuilder text = new StringBuilder(ItemRegistry.nameOf(entry.getKey()));
            text.append("  (level ").append(recipe.levelRequired()).append(") - ");
            recipe.inputs().forEach((id, count) ->
                    text.append(count).append(" ").append(ItemRegistry.nameOf(id).toLowerCase()).append(" "));
            options.add(new Option(entry.getKey(), text.toString().trim(), levelOk && hasOre));
        }
        chooser(owner, "Furnace", "What would you like to smelt?", options,
                (id, quantity) -> engine.startSmelting(id, quantity, furnace));
    }

    public static void smithing(Frame owner, GameEngine engine, Position anvil) {
        List<Option> options = new ArrayList<>();
        for (Map.Entry<String, ProcessAction.Recipe> entry : Recipes.SMITHING.entrySet()) {
            ProcessAction.Recipe recipe = entry.getValue();
            Map.Entry<String, Integer> bar = recipe.inputs().entrySet().iterator().next();
            if (!engine.player().inventory().contains(bar.getKey())) {
                continue;
            }
            boolean usable = engine.player().skills().level(SkillType.SMITHING) >= recipe.levelRequired()
                    && engine.player().inventory().contains(bar.getKey(), bar.getValue());
            options.add(new Option(entry.getKey(), ItemRegistry.nameOf(entry.getKey())
                    + "  (level " + recipe.levelRequired() + ") - " + bar.getValue() + " "
                    + ItemRegistry.nameOf(bar.getKey()).toLowerCase(), usable));
        }
        if (options.isEmpty()) {
            engine.message("You need bars in your backpack to smith anything.");
            return;
        }
        chooser(owner, "Anvil", "What would you like to smith?", options,
                (id, quantity) -> engine.startSmithing(id, quantity, anvil));
    }

    public static void cooking(Frame owner, GameEngine engine, Position range) {
        List<Option> options = new ArrayList<>();
        for (String rawId : engine.player().inventory().distinctIds()) {
            ProcessAction.Recipe recipe = Recipes.COOKING.get(rawId);
            if (recipe == null) {
                continue;
            }
            boolean usable = engine.player().skills().level(SkillType.COOKING) >= recipe.levelRequired();
            options.add(new Option(rawId, ItemRegistry.nameOf(rawId) + "  (level "
                    + recipe.levelRequired() + ") - x " + engine.player().inventory().count(rawId), usable));
        }
        if (options.isEmpty()) {
            engine.message("You have nothing to cook.");
            return;
        }
        chooser(owner, "Cooking", "What would you like to cook?", options,
                (id, quantity) -> engine.startCooking(id, quantity, range));
    }

    // ------------------------------------------------------------------ conversation

    public static void dialogue(Frame owner, String speaker, List<String> lines) {
        JDialog dialog = frame(owner, speaker, 420, 220);
        JPanel content = new JPanel();
        content.setLayout(new BoxLayout(content, BoxLayout.Y_AXIS));
        content.setBackground(Theme.CHROME);
        content.setBorder(BorderFactory.createEmptyBorder(12, 14, 12, 14));
        JLabel name = new JLabel(speaker);
        name.setForeground(Theme.ACCENT);
        name.setFont(Theme.TITLE);
        content.add(name);
        content.add(Box.createVerticalStrut(8));
        for (String line : lines) {
            JLabel text = new JLabel(line);
            text.setForeground(Theme.TEXT);
            text.setFont(Theme.UI);
            content.add(text);
            content.add(Box.createVerticalStrut(4));
        }
        content.add(Box.createVerticalGlue());
        JButton close = button("Continue", dialog::dispose);
        close.setAlignmentX(Component.LEFT_ALIGNMENT);
        content.add(close);
        dialog.add(content, BorderLayout.CENTER);
        dialog.setVisible(true);
    }

    /** A short summary of an item, used by the examine option. */
    public static String describe(ItemDef def) {
        return def.name() + " - " + (def.equipable() ? "equipment" : "item")
                + ", worth " + def.value() + " coins.";
    }

    static JLabel centeredLabel(String text) {
        JLabel label = new JLabel(text, SwingConstants.CENTER);
        label.setForeground(Theme.TEXT);
        label.setFont(Theme.UI_BOLD);
        label.setPreferredSize(new Dimension(120, 20));
        return label;
    }
}
