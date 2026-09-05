#!/usr/bin/env bash
# Compiles the game into build/classes. No dependencies beyond a JDK 17+.
set -euo pipefail
cd "$(dirname "$0")"
OUT=build/classes
rm -rf "$OUT"
mkdir -p "$OUT"
find src/main/java -name '*.java' > build/sources.txt
find src/test/java -name '*.java' >> build/sources.txt 2>/dev/null || true
javac -Xlint:all,-serial,-this-escape -d "$OUT" @build/sources.txt
cp -r src/main/resources/. "$OUT"/
echo "Built $(wc -l < build/sources.txt) source files into $OUT"
