package com.exjets.aetheria.world;

/** An immutable tile coordinate. */
public record Position(int x, int y) {

    public int distanceTo(Position other) {
        return Math.max(Math.abs(x - other.x), Math.abs(y - other.y));
    }

    public boolean isAdjacentTo(Position other) {
        return distanceTo(other) <= 1;
    }

    /** True when the tiles share an edge, which is what interactions require. */
    public boolean isOrthogonallyAdjacentTo(Position other) {
        return Math.abs(x - other.x) + Math.abs(y - other.y) == 1;
    }

    public Position translate(int dx, int dy) {
        return new Position(x + dx, y + dy);
    }

    @Override
    public String toString() {
        return x + "," + y;
    }

    public static Position parse(String text) {
        String[] parts = text.split(",");
        return new Position(Integer.parseInt(parts[0].trim()), Integer.parseInt(parts[1].trim()));
    }
}
