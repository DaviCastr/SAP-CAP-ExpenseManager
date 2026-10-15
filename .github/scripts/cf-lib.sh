#!/usr/bin/env bash

POLL_SECONDS=30
HANA_TIMEOUT_SECONDS=1800
HEALTH_ATTEMPTS=20
HEALTH_PATH="/health/db"
HEALTH_TIMEOUT_SECONDS=20

hana_instance() {
    if [[ -n "${HANA_INSTANCE:-}" ]]; then
        echo "$HANA_INSTANCE"
        return
    fi

    local output
    output="$(cf services)"
    awk '$2 ~ /^hana-cloud/ && !found { print $1; found = 1 }' <<< "$output"
}

last_operation() {
    local output
    output="$(cf service "$1")"
    awk '/^[[:space:]]*status:/ && !found { sub(/^[[:space:]]*status:[[:space:]]*/, ""); print; found = 1 }' <<< "$output"
}

start_hana() {
    local instance
    local waited=0
    local status

    instance="$(hana_instance)"

    if [[ -z "$instance" ]]; then
        echo "::error::No SAP HANA Cloud instance found, set the HANA_INSTANCE variable"
        exit 1
    fi

    echo "Starting SAP HANA Cloud instance '${instance}'"

    if ! cf update-service "$instance" -c '{"data":{"serviceStopped":false}}'; then
        echo "::warning::Start request was not accepted, the instance may already be running"
        return
    fi

    while true; do
        status="$(last_operation "$instance")"
        echo "SAP HANA Cloud: ${status}"

        case "$status" in
            *succeeded*) return ;;
            *failed*)
                echo "::warning::SAP HANA Cloud start reported a failure"
                cf service "$instance"
                return
                ;;
        esac

        if (( waited >= HANA_TIMEOUT_SECONDS )); then
            echo "::error::SAP HANA Cloud did not start in ${HANA_TIMEOUT_SECONDS} seconds"
            exit 1
        fi

        sleep "$POLL_SECONDS"
        waited=$(( waited + POLL_SECONDS ))
    done
}

app_route() {
    local output
    output="$(cf app "$CF_APP")"
    awk '/^routes:/ && !found { split($2, routes, ","); print routes[1]; found = 1 }' <<< "$output"
}

is_healthy() {
    local route
    route="$(app_route 2> /dev/null)" || return 1
    [[ -n "$route" ]] && curl -gfsS -m "$HEALTH_TIMEOUT_SECONDS" -o /dev/null "https://${route}${HEALTH_PATH}" 2> /dev/null
}

check_health() {
    local url="https://$(app_route)${HEALTH_PATH}"

    for attempt in $(seq 1 "$HEALTH_ATTEMPTS"); do
        if curl -gfsS -o /dev/null "$url"; then
            echo "Application is healthy: ${url}"
            return
        fi

        echo "Waiting for the application (${attempt}/${HEALTH_ATTEMPTS})"
        sleep "$POLL_SECONDS"
    done

    echo "::error::Application did not answer at ${url}"
    exit 1
}
