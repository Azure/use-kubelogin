#!/usr/bin/env bash

set -euo pipefail

npm run build 2>&1 >/dev/null
git diff-index --quiet HEAD -- || echo "lib/index.js is not up to date. Please run 'npm run build' and commit the changes." && exit 1