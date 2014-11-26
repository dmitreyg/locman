Ext.define('LocmanUi.store.NavigationTreeData', {
    extend: 'Ext.data.TreeStore',
    model: 'LocmanUi.model.NavigationTreeModel',
    
    proxy: {
        type: 'direct',
        directFn: 'ExtRemote.LocmanService.getLocalizationTree',
        reader: {
            xtype: 'json',
            root: 'data',
            successProperty: 'success'
        }
    },

    root: {
        expanded: true,
        draggable: false,
        id: 'root',
        text: 'My Root'
    }
});