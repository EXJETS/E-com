#!/usr/bin/env bash
# Builds if needed, then starts the client. Any arguments are passed to the game.
set -euo pipefail
cd "$(dirname "$0")"
[ -d build/classes ] || ./build.sh
exec java -cp build/classes com.exjets.aetheria.Main "$@"
