#!/usr/bin/env dash
set -e

. /usr/share/openmediavault/scripts/helper-functions

if ! omv_config_exists "/config/services/storecli"; then
        omv_config_add_node "/config/services" "storecli"
        omv_config_add_key "/config/services/storecli" "enable" "0"
        omv_config_add_key "/config/services/storecli" "binary" "storecli64"
        omv_config_add_key "/config/services/storecli" "fallback" "storcli64"
fi

exit 0
