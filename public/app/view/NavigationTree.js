Ext.define('LocmanUi.view.NavigationTree', {
    extend: 'Ext.tree.Panel',
    xtype: 'navigationTree',
    alias: 'widget.navigationTree',
    rootVisible: false,
    itemId: 'navigationTree',
    viewConfig:{
        markDirty:false
    },
    root: {
        text: 'Show All Root',
        expanded: true
    },

    store: 'NavigationTreeData',

    initComponent: function () {
        this.callParent(arguments);
    }
});