Ext.define('LocmanUi.view.NewFileWindow', {
    extend: 'Ext.Window',
    alias: 'widget.newFileWindow',
    title: 'New File',
    width: 500,
    autoHeight: true,
    layout: 'fit',
    modal: true,
    frame: false,
    border: false,
    items: [
        {
            xtype: 'form',
            itemId: 'newFileForm',
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
                itemId: 'newFileName',
                fieldLabel: 'Name',
                allowBlank: false,
                readonly: true
            }],

            buttons: [
                {
                    xtype: 'button',
                    iconCls: 'applyButton',
                    text: 'OK',
                    itemId: 'okNewFileButton'
                },
                {
                    xtype: 'button',
                    iconCls: 'cancelButton',
                    text: 'Cancel',
                    itemId: 'cancelNewFileButton'
                }
            ]
        }
    ],


    initComponent: function () {
        this.callParent(arguments);
    }
});
