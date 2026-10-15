#!/usr/bin/env bash
set -euo pipefail

source "$(dirname "$0")/cf-lib.sh"

if [[ -z "${SMTP_USER:-}" || -z "${SMTP_PASSWORD:-}" ]]; then
    echo "::warning::SMTP_USER or SMTP_PASSWORD is not configured, emails stay disabled"
    exit 0
fi

echo "Configuring email for '${CF_APP}'"
cf set-env "$CF_APP" SMTPHost "$SMTP_HOST" > /dev/null
cf set-env "$CF_APP" SMTPAddres "$SMTP_USER" > /dev/null
cf set-env "$CF_APP" SMTPKey "$SMTP_PASSWORD" > /dev/null

cf restart "$CF_APP"

check_health
