// require("js/omv/module/admin/service/ServicePanel.js");

/**
 * Base panel for Docker-based OpenMediaVault services.
 * Provides common functionality for Install/Remove/Restart operations,
 * status display, logs viewing, and web interface access.
 */
Ext.define('OMV.module.admin.service.BaseDockerServicePanel', {
    extend: 'OMV.module.admin.service.ServicePanel',

    // Subclasses must override these properties
    serviceName: null,     // e.g., 'Drone', 'Gitea', 'Immich'
    webPort: null,         // e.g., 8080, 3080, 2285
    webPath: '',           // e.g., '', '/admin', '/login'

    defaults: {
        flex: 1,
        xtype: 'button'
    },

    getButtonItems: function() {
        var me = this;
        var buttons = [{
            text: _('Install'),
            iconCls: 'x-fa fa-download',
            handler: me.onInstall,
            scope: me
        }, {
            text: _('Restart'),
            iconCls: 'x-fa fa-sync',
            handler: me.onRestart,
            scope: me
        }, {
            text: _('Remove'),
            iconCls: 'x-fa fa-trash',
            handler: me.onRemove,
            scope: me
        }, {
            text: _('View Logs'),
            iconCls: 'x-fa fa-file-text',
            handler: me.onViewLogs,
            scope: me
        }];

        // Add "Open Web Interface" button if web port is configured
        if (me.webPort) {
            buttons.splice(1, 0, {
                text: _('Open Web Interface'),
                iconCls: 'x-fa fa-external-link',
                handler: me.onOpenWebInterface,
                scope: me
            });
        }

        return buttons;
    },

    getStatusItems: function() {
        var me = this;
        return [{
            xtype: 'displayfield',
            fieldLabel: _('Status'),
            name: 'status',
            value: _('Unknown')
        }, {
            xtype: 'displayfield',
            fieldLabel: _('Running'),
            name: 'running',
            value: _('Unknown')
        }];
    },

    onInstall: function() {
        var me = this;
        me.doAjax('install', 
            Ext.String.format(_('Installing {0}...'), me.serviceName),
            Ext.String.format(_('{0} has been installed.'), me.serviceName)
        );
    },

    onRemove: function() {
        var me = this;
        OMV.MessageBox.show({
            title: _('Confirmation'),
            msg: Ext.String.format(_('Are you sure you want to remove {0}? This will delete all data.'), me.serviceName),
            buttons: Ext.Msg.YESNO,
            fn: function(answer) {
                if (answer === 'yes') {
                    me.doAjax('remove',
                        Ext.String.format(_('Removing {0}...'), me.serviceName),
                        Ext.String.format(_('{0} stack removed.'), me.serviceName)
                    );
                }
            },
            scope: me,
            icon: Ext.Msg.QUESTION
        });
    },

    onRestart: function() {
        var me = this;
        me.doAjax('restart',
            Ext.String.format(_('Restarting {0}...'), me.serviceName),
            Ext.String.format(_('{0} restarted.'), me.serviceName)
        );
    },

    onOpenWebInterface: function() {
        var me = this;
        var url = 'http://' + window.location.hostname + ':' + me.webPort + me.webPath;
        window.open(url, '_blank');
    },

    onViewLogs: function() {
        var me = this;
        
        // Show loading mask
        me.setLoading(true);
        
        // Call the RPC method to get logs
        OMV.Rpc.request({
            scope: me,
            callback: function(id, success, response) {
                me.setLoading(false);
                if (success) {
                    me.showLogsWindow(response.logs, response.error);
                } else {
                    OMV.MessageBox.error(null, response);
                }
            },
            rpcData: {
                service: me.rpcService,
                method: 'getLogs'
            }
        });
    },

    showLogsWindow: function(logs, error) {
        var me = this;
        
        var logText = logs || _('No logs available');
        if (error) {
            logText = _('Error retrieving logs: ') + error;
        }

        Ext.create('Ext.window.Window', {
            title: Ext.String.format(_('{0} Logs'), me.serviceName),
            width: 800,
            height: 600,
            layout: 'fit',
            modal: true,
            items: [{
                xtype: 'textarea',
                value: logText,
                readOnly: true,
                style: {
                    fontFamily: 'monospace',
                    fontSize: '12px'
                }
            }],
            buttons: [{
                text: _('Refresh'),
                handler: function() {
                    this.up('window').close();
                    me.onViewLogs();
                }
            }, {
                text: _('Close'),
                handler: function() {
                    this.up('window').close();
                }
            }]
        }).show();
    }
});