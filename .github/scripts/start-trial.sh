#!/usr/bin/env bash
set -euo pipefail

source "$(dirname "$0")/cf-lib.sh"

if is_healthy; then
    echo "SAP HANA Cloud and '${CF_APP}' are already running, nothing to do"
    exit 0
fi

start_hana

echo "Restarting application '${CF_APP}'"
cf restart "$CF_APP"

check_health
