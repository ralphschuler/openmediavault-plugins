#!/usr/bin/env dash
set -e

. /usr/share/openmediavault/scripts/helper-functions

########################################################################
# Bootstrap Gitea service configuration
########################################################################
if ! omv_config_exists "/config/services/gitea"; then
        omv_config_add_node "/config/services" "gitea"
        omv_config_add_key "/config/services/gitea" "enable" "0"
        omv_config_add_key "/config/services/gitea" "composepath" \
                "/srv/dev-disk-by-label-data/gitea"
        omv_config_add_key "/config/services/gitea" "timezone" ""
        omv_config_add_key "/config/services/gitea" "httpport" "3080"
        omv_config_add_key "/config/services/gitea" "sshport" "2222"
fi

exit 0
