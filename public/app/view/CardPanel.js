Ext.define('LocmanUi.view.CardPanel', {
    extend: 'Ext.panel.Panel',
    xtype: 'cardPanel',
    layout: 'card',

    items: [
        {
            xtype: 'resourceGrid',
            itemId: 'resourceGrid'
        },
        {
            xtype: 'languageSummaryPanel',
            itemId: 'summaryPanel'
        }

    ],

    initComponent: function () {
        this.callParent(arguments);
    }

});