#!/usr/bin/env bash
set -euo pipefail

source "$(dirname "$0")/cf-lib.sh"

if is_healthy; then
    echo "SAP HANA Cloud is already running"
    exit 0
fi

start_hana
