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

    getFormItems: function () {
        var me = this;
        return [
            {
                xtype: 'fieldset',
                title: _('Service Status'),
                items: [
                    {
                        xtype: 'displayfield',
                        fieldLabel: _('Status'),
                        name: 'status',
                        value: _('Loading...')
                    },
                    {
                        xtype: 'displayfield',
                        fieldLabel: _('Running'),
                        name: 'running',
                        value: _('Loading...')
                    }
                ]
            }
        ];
    },

    getButtonItems: function () {
        var me = this;
        return [
            {
                text: _('Install'),
                iconCls: 'x-fa fa-download',
                handler: me.onInstall,
                scope: me
            },
            {
                text: _('Open Web Interface'),
                iconCls: 'x-fa fa-external-link',
                handler: me.onOpenWebInterface,
                scope: me
            },
            {
                text: _('Restart'),
                iconCls: 'x-fa fa-sync',
                handler: me.onRestart,
                scope: me
            },
            {
                text: _('View Logs'),
                iconCls: 'x-fa fa-file-text',
                handler: me.onViewLogs,
                scope: me
            },
            {
                text: _('Remove'),
                iconCls: 'x-fa fa-trash',
                handler: me.onRemove,
                scope: me
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
        var me = this;
        OMV.MessageBox.show({
            title: _('Confirmation'),
            msg: _(
                'Are you sure you want to remove Gitea? This will delete all data.'
            ),
            buttons: Ext.Msg.YESNO,
            fn: function (answer) {
                if (answer === 'yes') {
                    me.doAjax(
                        'remove',
                        _('Removing Gitea...'),
                        _('Gitea stack removed.')
                    );
                }
            },
            scope: me,
            icon: Ext.Msg.QUESTION
        });
    },

    onRestart: function () {
        this.doAjax('restart', _('Restarting Gitea...'), _('Gitea restarted.'));
    },

    onOpenWebInterface: function () {
        var url = 'http://' + window.location.hostname + ':3080';
        window.open(url, '_blank');
    },

    onViewLogs: function () {
        var me = this;
        me.setLoading(true);

        OMV.Rpc.request({
            scope: me,
            callback: function (id, success, response) {
                me.setLoading(false);
                if (success) {
                    me.showLogsWindow(response.logs, response.error);
                } else {
                    OMV.MessageBox.error(null, response);
                }
            },
            rpcData: {
                service: 'Gitea',
                method: 'getLogs'
            }
        });
    },

    showLogsWindow: function (logs, error) {
        var me = this;
        var logText = logs || _('No logs available');
        if (error) {
            logText = _('Error retrieving logs: ') + error;
        }

        Ext.create('Ext.window.Window', {
            title: _('Gitea Logs'),
            width: 800,
            height: 600,
            layout: 'fit',
            modal: true,
            items: [
                {
                    xtype: 'textarea',
                    value: logText,
                    readOnly: true,
                    style: {
                        fontFamily: 'monospace',
                        fontSize: '12px'
                    }
                }
            ],
            buttons: [
                {
                    text: _('Refresh'),
                    handler: function () {
                        this.up('window').close();
                        me.onViewLogs();
                    },
                    scope: this
                },
                {
                    text: _('Close'),
                    handler: function () {
                        this.up('window').close();
                    }
                }
            ]
        }).show();
    }
});

OMV.WorkspaceManager.registerPanel({
    id: 'gitea',
    path: '/service',
    text: _('Gitea'),
    position: 91,
    className: 'OMV.module.admin.service.Gitea'
});
