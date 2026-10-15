#!/usr/bin/env bash
set -euo pipefail

source "$(dirname "$0")/cf-lib.sh"

MTA_NAME="ExpenseManager"

echo "Building the MTA archive"
npm ci
npx mbt build --mtar "$MTA_NAME"

echo "Deploying ${MTA_NAME}"
cf deploy "mta_archives/${MTA_NAME}.mtar" -f

check_health
