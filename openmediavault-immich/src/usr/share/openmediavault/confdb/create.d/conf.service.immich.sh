#!/usr/bin/env dash
set -e

. /usr/share/openmediavault/scripts/helper-functions

########################################################################
# Bootstrap Immich service configuration
# <config>
#   <services>
#     <immich>
#       <enable>0|1</enable>
#       <composepath>/srv/dev-disk-by-label-data/immich</composepath>
#       <timezone></timezone>
#       <serverport>2283</serverport>
#       <webport>2285</webport>
#     </immich>
#   </services>
# </config>
########################################################################
if ! omv_config_exists "/config/services/immich"; then
        omv_config_add_node "/config/services" "immich"
        omv_config_add_key "/config/services/immich" "enable" "0"
        omv_config_add_key "/config/services/immich" "composepath" \
                "/srv/dev-disk-by-label-data/immich"
        omv_config_add_key "/config/services/immich" "timezone" ""
        omv_config_add_key "/config/services/immich" "serverport" "2283"
        omv_config_add_key "/config/services/immich" "webport" "2285"
fi

exit 0
