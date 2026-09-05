package com.exjets.aetheria.ui;

import javax.swing.BorderFactory;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTextArea;
import javax.swing.JTextField;
import javax.swing.ScrollPaneConstants;
import java.awt.BorderLayout;
import java.awt.Dimension;
import java.util.function.Consumer;

/** The message feed and the command line underneath it. */
public class ChatPanel extends JPanel {

    private final JTextArea output = new JTextArea();
    private final JTextField input = new JTextField();

    public ChatPanel(Consumer<String> onCommand) {
        setLayout(new BorderLayout());
        setBackground(Theme.CHROME);
        setBorder(BorderFactory.createMatteBorder(2, 0, 0, 0, Theme.BORDER));
        setPreferredSize(new Dimension(100, 150));

        output.setEditable(false);
        output.setLineWrap(true);
        output.setWrapStyleWord(true);
        output.setBackground(Theme.SLOT);
        output.setForeground(Theme.TEXT);
        output.setFont(Theme.UI);
        output.setBorder(BorderFactory.createEmptyBorder(6, 8, 6, 8));

        JScrollPane scroll = new JScrollPane(output);
        scroll.setBorder(BorderFactory.createEmptyBorder());
        scroll.setVerticalScrollBarPolicy(ScrollPaneConstants.VERTICAL_SCROLLBAR_ALWAYS);
        add(scroll, BorderLayout.CENTER);

        input.setBackground(Theme.CHROME_LIGHT);
        input.setForeground(Theme.TEXT);
        input.setCaretColor(Theme.ACCENT);
        input.setFont(Theme.UI);
        input.setBorder(BorderFactory.createEmptyBorder(6, 8, 6, 8));
        input.addActionListener(event -> {
            String text = input.getText().trim();
            input.setText("");
            if (!text.isEmpty()) {
                onCommand.accept(text);
            }
        });
        add(input, BorderLayout.SOUTH);
    }

    public void append(String message) {
        output.append(message + "\n");
        output.setCaretPosition(output.getDocument().getLength());
    }

    /** True while the player is writing in the chat box, so hotkeys stay out of the way. */
    public boolean isTyping() {
        return input.isFocusOwner();
    }

    public void focusInput() {
        input.requestFocusInWindow();
    }
}
