// require("js/omv/WorkspaceManager.js");
// require("js/omv/module/admin/service/ServicePanel.js");

Ext.define('OMV.module.admin.service.Immich', {
    extend: 'OMV.module.admin.service.ServicePanel',
    alias: 'widget.service-immich',

    rpcService: 'Immich',
    rpcGetMethod: 'getStatus',

    defaults: {
        flex: 1,
        xtype: 'button'
    },

    getButtonItems: function () {
        return [
            {
                text: _('Install'),
                iconCls: 'x-fa fa-download',
                handler: this.onInstall,
                scope: this
            },
            {
                text: _('Restart'),
                iconCls: 'x-fa fa-sync',
                handler: this.onRestart,
                scope: this
            },
            {
                text: _('Remove'),
                iconCls: 'x-fa fa-trash',
                handler: this.onRemove,
                scope: this
            }
        ];
    },

    onInstall: function () {
        this.doAjax(
            'install',
            _('Installing Immich...'),
            _('Immich has been installed.')
        );
    },

    onRemove: function () {
        this.doAjax(
            'remove',
            _('Removing Immich...'),
            _('Immich stack removed.')
        );
    },

    onRestart: function () {
        this.doAjax(
            'restart',
            _('Restarting Immich...'),
            _('Immich restarted.')
        );
    }
});

OMV.WorkspaceManager.registerPanel({
    id: 'immich',
    path: '/service',
    text: _('Immich'),
    position: 90,
    className: 'OMV.module.admin.service.Immich'
});
