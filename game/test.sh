#!/usr/bin/env bash
# Builds and runs the test suite; exits non-zero if any check fails.
set -euo pipefail
cd "$(dirname "$0")"
./build.sh
java -cp build/classes com.exjets.aetheria.TestRunner
