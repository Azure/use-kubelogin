#!/usr/bin/env bash

set -euo pipefail

npm run build 2>&1 >/dev/null
git status --porcelain=v1 2>/dev/null | grep -q '^.M lib/index.js' && (echo "Generated files are out of date. Please run 'npm run build' and commit the changes." && exit 1) || exit 0