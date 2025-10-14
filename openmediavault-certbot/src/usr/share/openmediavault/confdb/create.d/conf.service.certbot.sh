#!/usr/bin/env dash
set -e

. /usr/share/openmediavault/scripts/helper-functions

if ! omv_config_exists "/config/services/certbot"; then
        omv_config_add_node "/config/services" "certbot"
        omv_config_add_key "/config/services/certbot" "enable" "0"
        omv_config_add_key "/config/services/certbot" "composepath" \
                "/srv/dev-disk-by-label-data/certbot"
        omv_config_add_key "/config/services/certbot" "email" ""
        omv_config_add_key "/config/services/certbot" "domains" ""
        omv_config_add_key "/config/services/certbot" "staging" "1"
        omv_config_add_key "/config/services/certbot" "httpport" "8088"
fi

exit 0
