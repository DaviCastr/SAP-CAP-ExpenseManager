#!/usr/bin/env bash
set -euo pipefail

source "$(dirname "$0")/cf-lib.sh"

# Own login: SETTINGS_SECRET signs the app tokens (falls back to the XSUAA client
# secret when absent) and ADMIN_EMAIL / ADMIN_PASSWORD create the first administrator.

changed=false

set_env() {
    local name="$1" value="$2"

    if [[ -n "$value" ]]; then
        cf set-env "$CF_APP" "$name" "$value" > /dev/null
        changed=true
    fi
}

set_env SETTINGS_SECRET "${SETTINGS_SECRET:-}"
set_env ADMIN_EMAIL "${ADMIN_EMAIL:-}"
set_env ADMIN_PASSWORD "${ADMIN_PASSWORD:-}"

if [[ -z "${ADMIN_EMAIL:-}" ]]; then
    echo "::warning::ADMIN_EMAIL is not configured, no administrator is created on start"
fi

if [[ "$changed" == true && "${RESTART_APP:-true}" == true ]]; then
    cf restart "$CF_APP"
    check_health
fi
