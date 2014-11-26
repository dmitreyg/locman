Ext.define('LocmanUi.controller.MainController', {
    extend: 'Ext.app.Controller',
    
    models: ['SimpleModel', 'ResourceModel'],
    stores: ['NavigationData', 'NavigationTreeData', 'ResourceData'],
    views: ['NavigationGrid', 'NavigationTree', 'ResourceGrid', 'EditResourceWindow', 'CardPanel', 'LanguageSummaryPanel'],

    refs: [
        { ref: 'editResourceWindow', selector: 'editResourceWindow' },
        { ref: 'addFolderWindow', selector: 'addFolderWindow' },
        { ref: 'newFileWindow', selector: 'newFileWindow' },
        { ref: 'resourceName', selector: '#resourceName' },
        { ref: 'resourceValue', selector: '#resourceValue' },
        { ref: 'resourceDefaultValue', selector: '#resourceDefaultValue' },
        { ref: 'folderName', selector: '#folderName' },
        { ref: 'newFileName', selector: '#newFileName' },
        { ref: 'addEditForm', selector: '#addEditForm'},
        { ref: 'addFolderButton', selector: '#addFolderButton'},
        { ref: 'resourceGrid', selector: '#resourceGrid'},
        { ref: 'navigationTree', selector: '#navigationTree'},
        { ref: 'cardPanel', selector: '#cardPanel'},
        { ref: 'translatedWordsCount', selector: '#translatedWordsCount'},
        { ref: 'totalResourcesStatus', selector: '#totalResourcesStatus'},
        { ref: 'translatedResourcesStatus', selector: '#translatedResourcesStatus'},
        { ref: 'notTranslatedResourcesStatus', selector: '#notTranslatedResourcesStatus'},
        { ref: 'totalWordsStatus', selector: '#totalWordsStatus'},
        { ref: 'translatedWordsStatus', selector: '#translatedWordsStatus'},
        { ref: 'languageSummaryForm', selector: '#languageSummaryForm'}

    ],

    selectedNode: null,

    init: function () {
        var me = this;

        this.control({
            'app-main': {
                beforerender: me.appMainBeforeRender,
                afterrender: me.appMainAfterRender
            },
            'resourceGrid': {
                itemclick: me.gridItemClick,
                itemdblclick: me.editButtonClick
            },
            'navigationTree': {
                itemclick: me.treeItemClick,
                itemcollapse: me.treeItemCollapse
            },
            '#addResourceStringButton': {
                click: this.addButtonClick
            },
            '#deleteResourceStringButton': {
                click: this.deleteResourceButtonClick
            },

            '#newFileButton': {
                click: this.newFileButtonClick
            },
            '#deleteFileButton': {
                click: this.deleteFileButtonClick
            },
            '#editResourceStringButton': {
                click: this.editButtonClick
            },
            '#addResourceStringButton': {
                click: this.addButtonClick
            },
            '#cancelAddEditButton': {
                click: this.cancelAddEditButtonClick
            },
            '#okAddEditButton': {
                click: this.okAddEditButtonClick
            },
            '#addFolderButton': {
                click: this.addFolderButtonClick
            },
            '#getButton': {
                click: this.getButtonClick
            },
            '#okAddFolderButton': {
                click: this.okAddFolderButtonClick
            },
            '#cancelAddFolderButton': {
                click: this.cancelAddFolderButtonClick
            },
            '#okNewFileButton': {
                click: this.okNewFileButtonClick
            },
            '#cancelNewFileButton': {
                click: this.cancelNewFileButtonClick
            },
            '#translateAddEditButton': {
                click: this.translateAddEditButtonClick
            },
            '#translateAllButton': {
                click: this.translateAllButtonClick
            }
        });

        me.getNavigationTreeDataStore().on('beforeload', me.onTreeDataStoreBeforeLoad, me);
        me.getResourceDataStore().on('beforeload', me.onResourceDataBeforeLoad, me);

    },

    translateAllButtonClick: function () {
        var me = this;

        if (!me.selectedNode || !me.selectedNode.parentNode) return;

        var folderName = me.selectedNode.parentNode.raw.nodeId;
        var fileName = me.selectedNode.raw.nodeId;
        var targetLanguage = folderName.substr(0,2);

        me.getResourceDataStore().each(function (record, index) {
            var key = record.get('name');
            var defaultValue = record.get('defaultValue');
            var value = record.get('value');

            if (value.length > 0) return;

            Ext.data.JsonP.request({
                url: API_URL,
                callbackKey: 'callback',
                params: {
                    key: API_KEY,
                    source: 'en',
                    target: targetLanguage,
                    q: defaultValue
                },

                success: function(result, request) {
                    var translated = result.data.translations[0].translatedText;
                    record.set('value', translated);

                    ExtRemote.LocmanService.updateResourceSync({
                        file: fileName,
                        folder: folderName,
                        key: key,
                        value: translated
                    }, function (result) {
                        me.selectedNode.set({text: me.selectedNode.raw.nodeId + ' (' + result.data + ')'});
                        me.updateStatusCounters(folderName, fileName);
                        me.getResourceDataStore().sync();
                    });
                }
            });
        });
    },

    translateAddEditButtonClick: function () {
        var me = this;

        var targetLanguage = me.selectedNode.parentNode.raw.nodeId.substr(0,2);
        var text = me.getResourceDefaultValue().getValue();

        if (text == '') {
            text = me.getResourceName().getValue();
        }

        Ext.data.JsonP.request({
            url: API_URL,
            callbackKey: 'callback',
            params: {
                key: API_KEY,
                source: 'en',
                target: targetLanguage,
                q: text
            },

            success: function(result, request) {
                if (Ext.isDefined(result.error) && result.error.errors.length > 0) {
                    Ext.Msg.alert('Error', "Translation service error. " + result.error.errors[0].message);
                    return;
                }

                me.getResourceValue().setValue(result.data.translations[0].translatedText);
            }
        });

    },

    cancelAddEditButtonClick: function () {
        var me = this;
        me.getEditResourceWindow().close();
    },

    okAddEditButtonClick: function () {
        var me = this;
        var found = false;

        if (!me.selectedNode || !me.selectedNode.parentNode) {
            me.getEditResourceWindow().close();
            return;
        }

        var folderName = me.selectedNode.parentNode.raw.nodeId;
        var fileName = me.selectedNode.raw.nodeId;

        me.getResourceDataStore().each(function (record, index) {
            var key = record.get('name');

            if(key == me.getResourceName().getValue()){
                record.set('value', me.getResourceValue().getValue());
                record.commit();
                found = true;
                ExtRemote.LocmanService.updateResourceSync({
                    file: fileName,
                    folder: folderName,
                    key: record.get('name'),
                    value: record.get('value')
                }, function (result) {
                    me.selectedNode.set({text: me.selectedNode.raw.nodeId + ' (' + result.data + ')'})
                    me.updateStatusCounters(folderName, fileName);
                });
            }
        });

        if (!found) {
            var record = Ext.create('LocmanUi.model.ResourceModel', {
                name: me.getResourceName().getValue(),
                value: me.getResourceValue().getValue(),
                defaultValue: me.getResourceValue().getValue()
            });

            me.getResourceDataStore().add(record);

            ExtRemote.LocmanService.updateResourceSync({
                file: fileName,
                folder: 'default',
                key: record.get('name'),
                value: record.get('value')
            }, function (result) {
                me.selectedNode.set({text: fileName + ' (' + result.data + ')'})
                me.updateStatusCounters(folderName, fileName);
            });
        }

        me.getEditResourceWindow().close();
    },

    addButtonClick: function () {
        var me = this;
        Ext.create('LocmanUi.view.EditResourceWindow').show();

        me.getResourceName().setDisabled(false);
    },

    deleteResourceButtonClick: function () {
        var me = this;

        if (!me.selectedNode) return;

        var folderName = (me.selectedNode.parentNode) ? me.selectedNode.parentNode.raw.nodeId : '';
        var fileName = me.selectedNode.raw.nodeId;

        //todo: delete warning

        me.getResourceDataStore().each(function (record, index) {
            var key = record.get('name');

            if(key == me.currentRecord.get('name')) {
                me.getResourceDataStore().remove(record);

                ExtRemote.LocmanService.deleteResource({
                    file: fileName,
                    key: record.get('name')
                }, function (result) {
                    me.selectedNode.set({text: fileName + ' (' + result.data + ')'})
                    if (folderName.length > 0) {
                        me.updateStatusCounters(folderName, fileName);
                    }
                });
            }
        });
    },

    editButtonClick: function () {
        var me = this;
        Ext.create('LocmanUi.view.EditResourceWindow').show();
        me.getAddEditForm().loadRecord(me.currentRecord);
        me.getResourceName().setDisabled(true);
    },

    addFolderButtonClick: function () {
        Ext.create('LocmanUi.view.AddFolderWindow').show();
    },

    newFileButtonClick: function () {
        Ext.create('LocmanUi.view.NewFileWindow').show();
    },

    deleteFileButtonClick: function () {
        var me = this;

        if (!me.selectedNode) return;

        var record = me.selectedNode;

        var objName = record.raw.nodeId;

        if (!record.raw.leaf && objName == 'default') return;

        if (record.raw.leaf) {
            //todo: delete file warning

            var folderName = record.parentNode.raw.nodeId;

            ExtRemote.LocmanService.deleteFile({
                folderName: folderName,
                fileName: objName
            }, function () {
                me.getNavigationTreeDataStore().setRootNode({ expanded: true, nodeId: 'root' })
            });

        } else {

            if (objName == 'default') return;

            //todo: delete language folder warning


            ExtRemote.LocmanService.deleteFolder({
                name: objName
            }, function () {
                me.getNavigationTreeDataStore().setRootNode({ expanded: true, nodeId: 'root' })
            });

        }
    },

    getButtonClick: function () {
        var me = this;
        var record = me.selectedNode;

        if (!record || ! record.parentNode)
            return;

        if (record.raw.leaf) {
            var folderName = record.parentNode.raw.nodeId;
            var fileName = record.raw.nodeId;

            window.open('/download?folder=' + folderName + '&file=' + fileName,'_blank');

        } else {
            //todo: zip all files in the directory
        }
    },

    okAddFolderButtonClick: function () {
        var me = this;

        ExtRemote.LocmanService.createFolder({
            name: me.getFolderName().getValue()
        }, function () {
            me.getNavigationTreeDataStore().setRootNode({ expanded: true, nodeId: 'root' })
        });

        me.getAddFolderWindow().close();
    },

    cancelAddFolderButtonClick: function () {
        var me = this;
        me.getAddFolderWindow().close();
    },

    okNewFileButtonClick: function () {
        var me = this;
        ExtRemote.LocmanService.createFile({
            name: me.getNewFileName().getValue()
        }, function () {
            me.getNavigationTreeDataStore().setRootNode({ expanded: true, nodeId: 'root' })
        });

        me.getNewFileWindow().close();
    },

    cancelNewFileButtonClick: function () {
        var me = this;
        me.getNewFileWindow().close();
    },

    onTreeDataStoreBeforeLoad: function(store, op) {
        op.params.node = op.node.get('nodeId');
        return true;
    },
    
    gridItemClick: function (obj, record, item, index, e, eOpts) {
        var me = this;
        me.currentRecord = record;
    },

    updateStatusCounters: function (folder, file) {
        var me = this;

        ExtRemote.LocmanService.getCounters({
            file: file,
            folder: folder
        }, function (result) {
            me.getTotalResourcesStatus().setText('Total Resources: ' + result.data.totalResources);
            me.getTranslatedResourcesStatus().setText('Translated Resources: ' + result.data.translatedResources);
            me.getNotTranslatedResourcesStatus().setText('Resources Remaining: ' + result.data.notTranslatedResources);
            me.getTotalWordsStatus().setText('Total Words: ' + result.data.totalWords);
            me.getTranslatedWordsStatus().setText('Translated Words: ' + result.data.translatedWords);
        });
    },

    treeItemClick: function (obj, record, item, index, e, eOpts) {
        var me = this;
        me.selectedNode = record;

        if (record.raw.leaf) {
            me.getResourceDataStore().load();
            me.getCardPanel().getLayout().setActiveItem(0);
            me.updateStatusCounters(me.selectedNode.parentNode.raw.nodeId, me.selectedNode.raw.nodeId);
        } else {

            ExtRemote.LocmanService.getCounters({
                file: me.selectedNode.raw.nodeId,
                folder: 'root'
            }, function (result) {
                me.getLanguageSummaryForm().getForm().setValues(result.data);
                //me.getTranslatedWordsCount().setValue(result.data);
                me.getCardPanel().getLayout().setActiveItem(1);
            });

        }
    },

    treeItemCollapse: function(node) {
        node.data.loaded = false;
    },

    treeAfterItemExpand: function ( node, index, item, eOpts ){
        var me = this;

        var treeStore = me.getNavigationTreeDataStore();
        var view =  this.getNavigationTree().view;

        if (!treeStore.clearOnLoad) {
            node.removeAll();
        }




        var viewRefresher = function() {
            view.refresh();
        };

        treeStore.load({
            node: node,
            callback: viewRefresher
        });
    },
    
    onResourceDataBeforeLoad: function (e, operation) {
        var me = this;
        operation.params = { file: me.selectedNode.raw.nodeId, folder: me.selectedNode.parentNode.raw.nodeId };
        return true;
    },

    appMainBeforeRender: function () {
        var me = this;
    },

    appMainAfterRender: function () {
        var me = this;
    }

});
