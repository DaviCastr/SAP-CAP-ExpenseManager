#!/usr/bin/env bash
set -euo pipefail

CONFIG_FILE="webapp/config/runtime-config.json"

app_route() {
    local output
    output="$(cf app "$CF_APP")"
    awk '/^routes:/ && !found { split($2, routes, ","); print routes[1]; found = 1 }' <<< "$output"
}

uaa_credentials() {
    local output
    output="$(cf service-key "$UAA_INSTANCE" "$UAA_KEY")"
    sed -n '/^{/,$p' <<< "$output" | jq '.credentials // .'
}

route="$(app_route)"

if [[ -z "$route" ]]; then
    echo "::error::Application '${CF_APP}' has no route, deploy the CAP project first"
    exit 1
fi

credentials="$(uaa_credentials)"
service_url="https://${route}"

jq -n \
    --arg service "$service_url" \
    --arg authDomain "$(jq -r '.url' <<< "$credentials")" \
    --arg clientId "$(jq -r '.clientid' <<< "$credentials")" \
    --arg appName "$(jq -r '.xsappname' <<< "$credentials")" \
    --arg redirectUri "$UI5_PAGES_URL" \
    '{
        btpHost: $service,
        odataService: "\($service)/service/ExpenseManager/",
        auth: {
            authDomain: $authDomain,
            clientId: $clientId,
            scope: "openid \($appName).ExpenseManagerUser",
            redirectUri: $redirectUri,
            tokenEndpoint: "\($service)/auth/login",
            refreshEndpoint: "\($service)/auth/refresh"
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
git commit -m "build(config): atualiza URLs do CAP e do XSUAA após mudança no BTP"
git push
echo "UI5 configuration updated, GitHub Pages deployment started"
