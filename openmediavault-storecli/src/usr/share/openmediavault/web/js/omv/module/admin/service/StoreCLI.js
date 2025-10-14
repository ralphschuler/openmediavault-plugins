// require("js/omv/WorkspaceManager.js");
// require("js/omv/module/admin/service/ServicePanel.js");

Ext.define('OMV.module.admin.service.StoreCLI', {
    extend: 'OMV.module.admin.service.ServicePanel',
    alias: 'widget.service-storecli',

    rpcService: 'StoreCLI',
    rpcGetMethod: 'getStatus',

    defaults: {
        flex: 1,
        xtype: 'button'
    },

    getFormItems: function () {
        return [
            {
                xtype: 'fieldset',
                title: _('StoreCLI Status'),
                defaults: {
                    anchor: '100%'
                },
                items: [
                    {
                        xtype: 'displayfield',
                        fieldLabel: _('Binary Available'),
                        name: 'installed',
                        renderer: OMV.util.Format.booleanValueRenderer()
                    },
                    {
                        xtype: 'displayfield',
                        fieldLabel: _('Binary Path'),
                        name: 'binary',
                        value: _('Not detected')
                    },
                    {
                        xtype: 'displayfield',
                        fieldLabel: _('Version'),
                        name: 'version',
                        value: _('Unknown')
                    },
                    {
                        xtype: 'textarea',
                        fieldLabel: _('Summary'),
                        name: 'summary',
                        readOnly: true,
                        grow: true,
                        growMax: 400,
                        height: 240,
                        cls: 'x-form-textarea-monospaced'
                    },
                    {
                        xtype: 'textarea',
                        fieldLabel: _('Controller Hints'),
                        name: 'controllerHints',
                        readOnly: true,
                        grow: true,
                        growMax: 200,
                        height: 120,
                        cls: 'x-form-textarea-monospaced'
                    },
                    {
                        xtype: 'textarea',
                        fieldLabel: _('Errors'),
                        name: 'error',
                        readOnly: true,
                        grow: true,
                        growMax: 200,
                        height: 120,
                        cls: 'x-form-textarea-monospaced'
                    }
                ]
            }
        ];
    },

    getButtonItems: function () {
        return [
            {
                text: _('Refresh Summary'),
                iconCls: 'x-fa fa-sync',
                handler: this.doReload,
                scope: this
            },
            {
                text: _('Controller Details'),
                iconCls: 'x-fa fa-hdd',
                handler: this.onShowController,
                scope: this
            },
            {
                text: _('View Event Log'),
                iconCls: 'x-fa fa-list',
                handler: this.onViewEventLog,
                scope: this
            }
        ];
    },

    onShowController: function () {
        var me = this;
        OMV.MessageBox.prompt(
            _('Controller ID'),
            _('Enter controller number or "all"'),
            function (answer) {
                if (!answer) {
                    return;
                }

                me.setLoading(true);
                OMV.Rpc.request({
                    scope: me,
                    callback: function (id, success, response) {
                        me.setLoading(false);
                        if (success) {
                            me.showOutputWindow(
                                _('Controller Details'),
                                response.stdout,
                                response.stderr
                            );
                        } else {
                            OMV.MessageBox.error(null, response);
                        }
                    },
                    rpcData: {
                        service: 'StoreCLI',
                        method: 'getControllerDetails',
                        params: {
                            controller: answer,
                            arguments: ['show', 'all']
                        }
                    }
                });
            }
        );
    },

    onViewEventLog: function () {
        var me = this;
        me.setLoading(true);

        OMV.Rpc.request({
            scope: me,
            callback: function (id, success, response) {
                me.setLoading(false);
                if (success) {
                    me.showOutputWindow(
                        _('Event Log'),
                        response.logs || '',
                        response.error
                    );
                } else {
                    OMV.MessageBox.error(null, response);
                }
            },
            rpcData: {
                service: 'StoreCLI',
                method: 'getLogs'
            }
        });
    },

    showOutputWindow: function (title, stdout, stderr) {
        var content = stdout || _('No output');
        if (stderr) {
            content += '\n\n' + _('Errors:') + '\n' + stderr;
        }

        Ext.create('Ext.window.Window', {
            title: title,
            width: 900,
            height: 600,
            modal: true,
            layout: 'fit',
            items: [
                {
                    xtype: 'textarea',
                    value: content,
                    readOnly: true,
                    cls: 'x-form-textarea-monospaced'
                }
            ],
            buttons: [
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
    id: 'storecli',
    path: '/service',
    text: _('StoreCLI RAID'),
    position: 95,
    className: 'OMV.module.admin.service.StoreCLI'
});
