#!/usr/bin/env dash
set -e

. /usr/share/openmediavault/scripts/helper-functions

if ! omv_config_exists "/config/services/drone"; then
        omv_config_add_node "/config/services" "drone"
        omv_config_add_key "/config/services/drone" "enable" "0"
        omv_config_add_key "/config/services/drone" "composepath" \
                "/srv/dev-disk-by-label-data/drone"
        omv_config_add_key "/config/services/drone" "timezone" ""
        omv_config_add_key "/config/services/drone" "serverport" "8080"
fi

exit 0
