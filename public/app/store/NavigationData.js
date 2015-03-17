Ext.define('LocmanUi.store.NavigationData', {
    extend: 'Ext.data.Store',
    model: 'LocmanUi.model.ResourceModel',
    proxy: {
        type: 'direct',
        directFn: 'ExtRemote.LocmanService.readDirectory',
        reader: {
            xtype: 'json',
            root: 'data',
            //totalProperty: 'totalCount',
            successProperty: 'success',
            idProperty: 'id'
        }
    }
});
