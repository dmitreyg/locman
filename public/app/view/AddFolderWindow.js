Ext.define('LocmanUi.view.AddFolderWindow', {
    extend: 'Ext.Window',
    alias: 'widget.addFolderWindow',
    title: 'Add Folder',
    width: 500,
    autoHeight: true,
    layout: 'fit',
    modal: true,
    frame: false,
    border: false,
    items: [
        {
            xtype: 'form',
            itemId: 'addFolderForm',
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
                itemId: 'folderName',
                fieldLabel: 'Name',
                allowBlank: false,
                readonly: true
            }],

            buttons: [
                {
                    xtype: 'button',
                    iconCls: 'applyButton',
                    text: 'OK',
                    itemId: 'okAddFolderButton'
                },
                {
                    xtype: 'button',
                    iconCls: 'cancelButton',
                    text: 'Cancel',
                    itemId: 'cancelAddFolderButton'
                }
            ]
        }
    ],


    initComponent: function () {
        this.callParent(arguments);
    }
});
