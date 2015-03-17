Ext.define("LocmanUi.view.NavigationGrid", {
    extend: "Ext.grid.Panel",
    xtype: "navigationGrid",
    store: 'NavigationData',
    columns: [
        { header: "", dataIndex: "id", width: 20 },
        { header: "Name", dataIndex: "name", flex: 1 }
    ],
    dockedItems: [{
        xtype: 'toolbar',
        dock: 'top',
        items: [
            {
                xtype: 'button',
                text: 'Add',
                iconCls: 'addButton',
                itemId: 'addButton'
            },
            {
                xtype: 'button',
                text: 'Delete',
                iconCls: 'deleteButton',
                itemId: 'deleteButton'
            }
        ]
    }]
});