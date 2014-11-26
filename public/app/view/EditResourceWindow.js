Ext.define('LocmanUi.view.EditResourceWindow', {
    extend: 'Ext.Window',
    alias: 'widget.editResourceWindow',
    title: 'Add/Edit',
    width: 500,
    autoHeight: true,
    layout: 'fit',
    modal: true,
    frame: false,
    border: false,
    items: [
        {
            xtype: 'form',
            itemId: 'addEditForm',
            bodyPadding: 10,
            border: 1,
            frame: false,

            fieldDefaults:
            {
                anchor: '90%'
            },

            items: [{
                xtype: 'textfield',
                name: 'name',
                itemId: 'resourceName',
                fieldLabel: 'Name',
                allowBlank: false,
                disabled: true
            }, {
                xtype: 'textareafield',
                name: 'value',
                itemId: 'resourceValue',
                fieldLabel: 'Local Value'
            }, {
                xtype: 'textfield',
                name: 'defaultValue',
                itemId: 'resourceDefaultValue',
                fieldLabel: 'Default Value',
                allowBlank: false,
                disabled: true
            }],

            buttons: [
                {
                    xtype: 'button',
                    iconCls: 'spellcheckButton',
                    text: 'Translate',
                    itemId: 'translateAddEditButton'
                },
                {
                    xtype: 'button',
                    iconCls: 'applyButton',
                    text: 'OK',
                    itemId: 'okAddEditButton'
                },
                {
                    xtype: 'button',
                    iconCls: 'cancelButton',
                    text: 'Cancel',
                    itemId: 'cancelAddEditButton'
                }
            ]
        }
    ],


    initComponent: function () {
        this.callParent(arguments);
    }
});
