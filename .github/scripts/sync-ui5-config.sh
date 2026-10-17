#!/usr/bin/env bash
set -euo pipefail

CONFIG_FILE="webapp/config/runtime-config.json"

app_route() {
    local output
    output="$(cf app "$CF_APP")"
    awk '/^routes:/ && !found { split($2, routes, ","); print routes[1]; found = 1 }' <<< "$output"
}

route="$(app_route)"

if [[ -z "$route" ]]; then
    echo "::error::Application '${CF_APP}' has no route, deploy the CAP project first"
    exit 1
fi

service_url="https://${route}"

jq -n \
    --arg service "$service_url" \
    '{
        btpHost: $service,
        odataService: "\($service)/service/ExpenseManager/",
        auth: {
            baseUrl: "\($service)/auth"
        }
    }' > "ui5/${CONFIG_FILE}.new"

cd ui5
mv "${CONFIG_FILE}.new" "$CONFIG_FILE"

if git diff --quiet -- "$CONFIG_FILE"; then
    echo "UI5 configuration is already up to date"
    exit 0
fi

git diff -- "$CONFIG_FILE"
git config user.name "$GIT_AUTHOR_NAME"
git config user.email "$GIT_AUTHOR_EMAIL"
git add "$CONFIG_FILE"
git commit -m "build(config): atualiza as URLs do CAP após mudança no BTP"
git push
echo "UI5 configuration updated, GitHub Pages deployment started"
