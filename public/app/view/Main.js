Ext.define('LocmanUi.view.Main', {
    extend: 'Ext.container.Container',
    requires:[
        'Ext.tab.Panel',
        'Ext.layout.container.Border'
    ],
    
    xtype: 'app-main',

    layout: {
        type: 'border'
    },


    items: [
        {
            region: 'north',
            xtype: 'panel',
            border: false,
            frame: false,
            split: false,
            height: 68,
            itemId: 'logoPanel',
            layout: 'absolute',
            bodyStyle: 'background-image:url(/resources/images/headerTileLarge.png) !important',

            dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'bottom',
                    items: [
                        {
                            xtype: 'button',
                            text: 'New Folder',
                            iconCls: 'addButton',
                            itemId: 'addFolderButton'
                        },
                        {
                            xtype: 'button',
                            text: 'New File',
                            iconCls: 'addButton',
                            itemId: 'newFileButton'
                        },
                        {
                            xtype: 'button',
                            text: 'Download File',
                            iconCls: 'getButton',
                            itemId: 'getButton'
                        },
                        {
                            xtype: 'button',
                            text: 'Delete File',
                            iconCls: 'deleteButton',
                            itemId: 'deleteFileButton'
                        },
                        {
                            xtype: 'button',
                            text: 'New Resource',
                            iconCls: 'addButton',
                            itemId: 'addResourceStringButton'
                        },
                        {
                            xtype: 'button',
                            text: 'Edit Resource',
                            iconCls: 'editButton',
                            itemId: 'editResourceStringButton'
                        },
                        {
                            xtype: 'button',
                            text: 'Delete Resource',
                            iconCls: 'deleteButton',
                            itemId: 'deleteResourceStringButton'
                        },
                        {
                            xtype: 'button',
                            text: 'Translate All',
                            iconCls: 'spellcheckButton',
                            itemId: 'translateAllButton'
                        }
                    ]
                }
            ]
        },
        {
            region: 'west',
            xtype: 'panel',
            split: true,
            width: 250,
            layout: 'fit',
            items: [
                {
                    xtype: 'navigationTree'
                }
            ]
        },
        {
            region: 'center',
            xtype: 'panel',
            layout: 'fit',
            border: false,
            splitter: true,
            items: [
                {
                    xtype: 'cardPanel',
                    itemId: 'cardPanel'
                }
            ]
        }
    ]
});