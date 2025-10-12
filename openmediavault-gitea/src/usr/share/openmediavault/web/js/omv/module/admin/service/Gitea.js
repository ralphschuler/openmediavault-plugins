// require("js/omv/WorkspaceManager.js");
// require("js/omv/module/admin/service/ServicePanel.js");

Ext.define('OMV.module.admin.service.Gitea', {
    extend: 'OMV.module.admin.service.ServicePanel',
    alias: 'widget.service-gitea',

    rpcService: 'Gitea',
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
            _('Installing Gitea...'),
            _('Gitea has been installed.')
        );
    },

    onRemove: function () {
        this.doAjax(
            'remove',
            _('Removing Gitea...'),
            _('Gitea stack removed.')
        );
    },

    onRestart: function () {
        this.doAjax('restart', _('Restarting Gitea...'), _('Gitea restarted.'));
    }
});

OMV.WorkspaceManager.registerPanel({
    id: 'gitea',
    path: '/service',
    text: _('Gitea'),
    position: 91,
    className: 'OMV.module.admin.service.Gitea'
});
