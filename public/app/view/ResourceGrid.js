Ext.define('LocmanUi.view.ResourceGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'resourceGrid',
    store: 'ResourceData',

    viewConfig :
    {
        enableTextSelection: true
    },

    requires: [
        'Ext.grid.plugin.CellEditing'
    ],

    initComponent: function () {
        var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 1
        });

        var config = {
            plugins: [cellEditing],

            columns: [
                { header: 'Name', dataIndex: 'name', flex: 1 },
                { header: 'Local Value', dataIndex: 'value', flex: 1 },
                { header: 'Default Value', dataIndex: 'defaultValue', flex: 1 }
            ],
            dockedItems: [
                {
                    xtype: 'statusbar',
                    dock: 'bottom',
                    items: [
                        {
                            xtype: 'tbtext',
                            text: 'Translated Words: ',
                            itemId: 'translatedWordsStatus'
                        },

                        {
                            xtype: 'tbtext',
                            text: 'Total Resources: ',
                            itemId: 'totalResourcesStatus'
                        },

                        {
                            xtype: 'tbtext',
                            text: 'Translated Resources: ',
                            itemId: 'translatedResourcesStatus'
                        },

                        {
                            xtype: 'tbtext',
                            text: 'Resources Remaining: ',
                            itemId: 'notTranslatedResourcesStatus'
                        },

                        {
                            xtype: 'tbtext',
                            text: 'Total Words: ',
                            itemId: 'totalWordsStatus'
                        }

                    ]
                }

            ]
        }

        Ext.apply(this, config);

        this.callParent(arguments);
    }
});