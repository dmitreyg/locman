Ext.define('LocmanUi.store.ResourceData', {
    extend: 'Ext.data.Store',
    model: 'LocmanUi.model.ResourceModel',

    proxy: {
        type: 'direct',
        directFn: 'ExtRemote.LocmanService.getResources',
//        api: {
//            read: 'ExtRemote.LocmanService.getResources',
//            update: 'ExtRemote.LocmanService.updateResources'
//        },
        reader: {
            xtype: 'json',
            root: 'data',
            successProperty: 'success',
            idProperty: 'id'
        }
    }
});
