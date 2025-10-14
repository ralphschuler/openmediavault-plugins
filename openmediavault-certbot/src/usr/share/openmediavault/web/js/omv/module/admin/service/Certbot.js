// require("js/omv/module/admin/service/ServicePanel.js");

Ext.define('OMV.module.admin.service.Certbot', {
    extend: 'OMV.module.admin.service.ServicePanel',
    alias: 'widget.service-certbot',

    rpcService: 'Certbot',
    rpcGetMethod: 'getStatus',

    defaults: {
        flex: 1,
        xtype: 'button'
    },

    getFormItems: function () {
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
                    },
                    {
                        xtype: 'displayfield',
                        fieldLabel: _('Stack directory'),
                        value: '/srv/dev-disk-by-label-data/certbot'
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
            _('Configuring Certbot stack...'),
            _('Certbot stack prepared and running.')
        );
    },

    onRemove: function () {
        var me = this;
        OMV.MessageBox.show({
            title: _('Confirmation'),
            msg: _(
                'Removing Certbot will delete certificates stored under /srv/dev-disk-by-label-data/certbot. Continue?'
            ),
            buttons: Ext.Msg.YESNO,
            fn: function (answer) {
                if (answer === 'yes') {
                    me.doAjax(
                        'remove',
                        _('Removing Certbot stack...'),
                        _('Certbot stack removed.')
                    );
                }
            },
            scope: me,
            icon: Ext.Msg.QUESTION
        });
    },

    onRestart: function () {
        this.doAjax(
            'restart',
            _('Restarting Certbot services...'),
            _('Certbot services restarted.')
        );
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
                service: 'Certbot',
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
            title: _('Certbot Logs'),
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
    id: 'certbot',
    path: '/service',
    text: _('Certbot'),
    position: 92,
    className: 'OMV.module.admin.service.Certbot'
});
