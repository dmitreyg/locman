Ext.define('LocmanUi.view.LanguageSummaryPanel', {
    extend: 'Ext.panel.Panel',
    xtype: 'languageSummaryPanel',
    title: 'Language Summary',
    layout: 'border',

    items: [
        {
            xtype: 'form',
            itemId: 'languageSummaryForm',
            region: 'center',
            border: false,
            frame: false,
            bodyPadding: 10,
            defaults: {
                labelWidth: 200
            },

            items: [
                {
                    xtype: 'displayfield',
                    name: 'translatedWords',
                    itemId: 'translatedWords',
                    fieldLabel: 'Translated Words'
                },

                {
                    xtype: 'displayfield',
                    name: 'totalResources',
                    itemId: 'totalResources',
                    fieldLabel: 'Total Resources'
                },

                {
                    xtype: 'displayfield',
                    name: 'translatedResources',
                    itemId: 'translatedResources',
                    fieldLabel: 'Translated Resources'
                },

                {
                    xtype: 'displayfield',
                    name: 'notTranslatedResources',
                    itemId: 'notTranslatedResources',
                    fieldLabel: 'Resources Remaining'
                },

                {
                    xtype: 'displayfield',
                    name: 'totalWords',
                    itemId: 'totalWords',
                    fieldLabel: 'Total Words'
                }

            ]
        }
    ],

    initComponent: function () {
        this.callParent(arguments);
    }

});