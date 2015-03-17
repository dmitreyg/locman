Ext.define('LocmanUi.model.NavigationTreeModel', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'id', type: 'string' },
        { name: 'nodeId', type: 'string' },
        { name: 'nodeType', type: 'string' },
        { name: 'text', type: 'string' }
    ]
});