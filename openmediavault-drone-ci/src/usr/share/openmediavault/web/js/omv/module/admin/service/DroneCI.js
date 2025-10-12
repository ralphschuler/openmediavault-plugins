// require("js/omv/WorkspaceManager.js");
// require("js/omv/module/admin/service/ServicePanel.js");

Ext.define('OMV.module.admin.service.DroneCI', {
    extend: 'OMV.module.admin.service.ServicePanel',
    alias: 'widget.service-droneci',

    rpcService: 'DroneCI',
    rpcGetMethod: 'getStatus',

    defaults: {
        flex: 1,
        xtype: 'button'
    },

    getButtonItems: function() {
        return [{
            text: _('Install'),
            iconCls: 'x-fa fa-download',
            handler: this.onInstall,
            scope: this
        }, {
            text: _('Restart'),
            iconCls: 'x-fa fa-sync',
            handler: this.onRestart,
            scope: this
        }, {
            text: _('Remove'),
            iconCls: 'x-fa fa-trash',
            handler: this.onRemove,
            scope: this
        }];
    },

    onInstall: function() {
        this.doAjax('install', _('Installing Drone CI...'), _('Drone CI has been installed.'));
    },

    onRemove: function() {
        this.doAjax('remove', _('Removing Drone CI...'), _('Drone CI stack removed.'));
    },

    onRestart: function() {
        this.doAjax('restart', _('Restarting Drone CI...'), _('Drone CI restarted.'));
    }
});

OMV.WorkspaceManager.registerPanel({
    id: 'drone-ci',
    path: '/service',
    text: _('Drone CI'),
    position: 92,
    className: 'OMV.module.admin.service.DroneCI'
});
