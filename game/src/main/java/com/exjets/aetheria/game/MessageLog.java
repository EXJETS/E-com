package com.exjets.aetheria.game;

import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Deque;
import java.util.List;
import java.util.function.Consumer;

/** The rolling game message feed shown in the chatbox. */
public class MessageLog {

    private static final int MAX_MESSAGES = 200;

    private final Deque<String> messages = new ArrayDeque<>();
    private final List<Consumer<String>> listeners = new ArrayList<>();

    public void add(String message) {
        messages.addLast(message);
        while (messages.size() > MAX_MESSAGES) {
            messages.removeFirst();
        }
        for (Consumer<String> listener : listeners) {
            listener.accept(message);
        }
    }

    public void onMessage(Consumer<String> listener) {
        listeners.add(listener);
    }

    public List<String> messages() {
        return new ArrayList<>(messages);
    }

    public String last() {
        return messages.peekLast();
    }

    public int size() {
        return messages.size();
    }
}
