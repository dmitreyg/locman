var path = require('path');
var fs = require('fs');
var nconf = require('nconf');
var util = require('util');
var uuid = require('node-uuid');
var validator = require('validator');
var logger = require('npmlog');
var logfile = require('npmlog-file');
var fs = require("fs");
var zip = require("node-native-zip");

logfile.write(logger, 'service.log');

nconf.env().file({ file: 'config.json' });

var ServerConfig = nconf.get("ServerConfig"),
    ExtDirectConfig = nconf.get("ExtDirectConfig");

var LocmanService = {

    convertToSimpleModel: function(array) {
        var result = [];

        for (var i = 0; i < array.length; i++) {
            var row = {};
            row.id = array[i];
            row.name = array[i];
            row.description = array[i];
            result.push(row);
        }

        return result;
    },


    readDirectory: function (params, callback) {
        var me = this;
        var obj = fs.readdirSync(ServerConfig.localizationFolder);
        var utils = require('MyUtils');
        var models = utils.convertToSimpleModel(obj);

        callback({
            success: true,
            data: models,
            params: obj
        });
    },

    createFolder: function (params, callback) {
        var folderName = LocmanService.getFolderPath(params.name);
        fs.mkdir(folderName, callback({
            success: true,
            data: "OK",
            params: params
        }));
    },

    createFile: function (params, callback) {
        var me = this;

        var fileName = params.name.replace(/\.[^/.]+$/, "") + '.json';
        var filePath = LocmanService.getFilePath('default', fileName);


        if (fs.exists(filePath)) {
            callback({
                success: true,
                data: "OK",
                params: params
            });
            return;
        }

        fs.open(filePath, 'w', callback({
            success: true,
            data: "OK",
            params: params
        })); //create if not exists
    },

    deleteFile: function (params, callback) {
        var me = this;
        var filePath = LocmanService.getFilePath(params.folderName, params.fileName);

        if (!fs.existsSync(filePath)) {
            callback({
                success: true,
                data: "OK",
                params: params
            });
            return;
        }

        var trashFile = LocmanService.getFilePath('_trash', '_' + uuid.v1() + '_' + params.name);
        fs.renameSync(filePath, trashFile);

        callback ({
            success: true,
            data: "OK",
            params: params
        });
    },

    deleteFolder: function (params, callback) {
        var me = this;

        if (params.name == 'default')
            return;

        var folderPath = LocmanService.getFolderPath(params.name);

        fs.rmdirSync(folderPath);

        callback ({
            success: true,
            data: "OK",
            params: params
        });
    },

    deleteResource: function (params, callback) {
        var me = this;

        console.log(util.inspect(params, false, null));

        var fileName = LocmanService.getFilePath('default', params.file);

        fs.readFile(fileName, 'utf8', function (err, data) {
            if (err) {
                console.log('Error: ' + err);
                return;
            }

            var json = data.length == 0 ? [] : JSON.parse(data);

            for (var i = json.length -1; i >= 0 ; i--){
                if (json[i].name == params.key) {
                    json.splice(i, 1);
                }
            }

            fs.writeFileSync(fileName, JSON.stringify(json, null, '\t'));

            count = LocmanService.countNotTranslatedResources(params.folder, params.file);

            callback({
                success: true,
                data: count,
                params: params
            });

        });
    },

    updateResourceSync: function(params, callback) {
        var me = this;

        console.log(util.inspect(params, false, null));

        var fileName = LocmanService.getFilePath(params.folder, params.file);
        var data = fs.existsSync(fileName) ? fs.readFileSync(fileName, 'utf8') : "";
        var json = data.length == 0 ? [] : JSON.parse(data);
        var found = false;

        json.forEach(function (record) { //todo: need either function or tool
            if (record.name == params.key) {
                record.value = params.value;
                found = true;
            }
        });

        if (!found) {
            json.push({name: params.key, value: params.value});
        }

        fs.writeFileSync(fileName, JSON.stringify(json, null, '\t'));

        var count = LocmanService.countNotTranslatedResources(params.folder, params.file);

        callback({
            success: true,
            data: count,
            params: params
        });
    },


    updateResources: function (params, callback) {
        var me = this;

        console.log(util.inspect(params, false, null));

        var fileName = LocmanService.getFilePath(params.folder, params.file);

        if (!fs.existsSync(fileName)) {
            fs.openSync(fileName, 'w'); //create if not exists
        }

        fs.readFile(fileName, 'utf8', function (err, data) {
            if (err) {
                console.log('Error: ' + err);
                return;
            }

            var json = data.length == 0 ? [] : JSON.parse(data);
            var found = false;

            json.forEach(function (record) {
                if (record.name == params.key) { //todo: function or tool
                    record.value = params.value;
                    found = true;
                }
            });

            if (!found) {
                json.push({name: params.key, value: params.value});
            }

            fs.writeFileSync(fileName, JSON.stringify(json, null, '\t'));

            var count = LocmanService.countNotTranslatedResources(params.folder, params.file);

            callback({
                success: true,
                data: count,
                params: params
            });


        });
    },

    joinWithDefault: function(folder, file) { //, success
        var defaultData = LocmanService.parseJsonFileSync(LocmanService.getFilePath('default', file));
        var localData = LocmanService.parseJsonFileSync(LocmanService.getFilePath(folder, file));
        var resultData = [];

        defaultData.forEach(function (defaultRecord) {
            var exists = false;
            localData.forEach(function (localRecord)  {
                 if (localRecord.name == defaultRecord.name) {
                     var newRecord = {
                         name: localRecord.name,
                         value: localRecord.value,
                         defaultValue: defaultRecord.value
                     }
                     resultData.push(newRecord);
                     exists = true;
                     return;
                 }
            });

            if (!exists) {
                resultData.push(
                    {
                        name: defaultRecord.name,
                        value: '',
                        defaultValue: defaultRecord.value
                    }
                )
            }
        });

        return resultData;
        //success(resultData);
    },

    parseJsonFile: function (fileName, success) {
        var fs = require('fs');
        fs.readFile(fileName, 'utf8', function (err, data) {
            if (err) {
                console.log('Error: ' + err);
                return;
            }

            var json = JSON.parse(data);

            success(json);
        });
    },

    getFile: function (folder, file) {
        var fileName = LocmanService.getFilePath(folder, file);

        var data = fs.existsSync(fileName) ? fs.readFileSync(fileName, 'utf8') : "";

        return data;
    },

    zipFolder: function (folder) {
        var folderPath = LocmanService.getFolderPath(folder);
        var fileNames = fs.readdirSync(folderPath);


        var archive = new zip();

        archive.addFiles([
            { name: "moehah.txt", path: "./test/moehah.txt" },
            { name: "images/suz.jpg", path: "./test/images.jpg" }
        ], function (err) {
            if (err) return console.log("err while adding files", err);

            var buff = archive.toBuffer();

            fs.writeFile("./test2.zip", buff, function () {
                console.log("Finished");
            });
        });

        return data;
    },

    parseJsonFileSync: function (fileName) {
        var fs = require('fs');

        if (!fs.existsSync(fileName))
            return [];

        var data = fs.readFileSync(fileName, 'utf8');
        if (data.length == 0)
            return [];

        return JSON.parse(data);
    },

    getResources: function(params, callback) {
        callback(LocmanService.joinWithDefault(params.folder, params.file)); //, callback
    },

    getLocalizationTree: function(params, callback) {
        var currentFolder = params.node;
        var isRoot = currentFolder == 'root';
        var objects = isRoot ? fs.readdirSync(ServerConfig.localizationFolder) : fs.readdirSync(LocmanService.getFolderPath('default'));

        logger.log('info', 'Hello distributed log files!');
        logger.info('Hello again distributed logs');

        var nodes = LocmanService.convertToTreeModels(objects, currentFolder, false);

        callback({
            success: true,
            data: nodes,
            params: params
        });
    },

    convertToTreeModels: function (array, currentFolder, doCount) {
        var isFolder = currentFolder == 'root';
        var result = [];

        for (var i = 0; i < array.length; i++) {
            var objectName = array[i];

            if (objectName.substr(0,1) == "_") continue;

            var count = 0;

            if (!doCount) {
                count = LocmanService.countNotTranslatedResources(currentFolder, objectName)
            }

            var cls = LocmanService.getTreeNodeIconCls(currentFolder, objectName, count);

            var obj = {
                nodeId: objectName,
                text: objectName + ((count > 0) ? ' (' + count + ')' : ''),
                leaf: !isFolder,
                expanded: false,
                iconCls: cls,
                children: isFolder ? [] : false
            };

            result.push(obj);
        }

        return result;
    },

    countNotTranslatedResources: function (currentFolder, objectName) {
        var isFolder = currentFolder == 'root';

        var count = 0;

        if (!isFolder) {
            var records = LocmanService.joinWithDefault(currentFolder, objectName);

            records.forEach(function (record) {
                if (record.defaultValue!='' && record.value=='')
                    count++;
            });
        }

        return count;
    },

    getFileRecordsCounters: function(records) {
        var totalResources = 0, translatedResources = 0, totalWords = 0, translatedWords = 0, notTranslatedResources = 0;
        records.forEach(function (record) {
                if (record.value.trim().length > 0) {
                    translatedWords += record.value.split(' ').length;
                }

                if (record.defaultValue.trim().length > 0) {
                    totalWords += record.defaultValue.split(' ').length;
                }

                if (record.defaultValue != '') {
                    totalResources += 1;
                    if (record.value != '') {
                        translatedResources += 1;
                    } else {
                        notTranslatedResources += 1;
                    }
                }
        });

        return {
            totalResources: totalResources,
            translatedResources: translatedResources,
            totalWords: totalWords,
            translatedWords: translatedWords,
            notTranslatedResources: notTranslatedResources
        }
    },


    getCounters: function (params, callback) {
        var me = this;

        var currentFolder = params.folder;
        var objectName = params.file;

        var isFile = currentFolder != 'root';

        var result = {
            totalResources: 0,
            translatedResources: 0,
            totalWords: 0,
            translatedWords: 0,
            notTranslatedResources: 0
        };

        if (isFile) {
            var records = LocmanService.joinWithDefault(currentFolder, objectName);

            result = LocmanService.getFileRecordsCounters(records);

        } else {
            var files = fs.readdirSync(LocmanService.getFolderPath('default'));

            files.forEach(function(file) {
                var records = LocmanService.joinWithDefault(objectName, file);
                var cnt = LocmanService.getFileRecordsCounters(records);

                result.notTranslatedResources += cnt.notTranslatedResources;
                result.totalResources += cnt.totalResources;
                result.totalWords += cnt.totalWords;
                result.translatedResources += cnt.translatedResources;
                result.translatedWords += cnt.translatedWords;
            });
        }

        callback({
            success: true,
            data: result,
            params: params
        });

    },

    getTreeNodeIconCls: function (currentFolder, val, count) {
        var isFolder = currentFolder == 'root';

        var cls = 'fam';

        var folderName = isFolder ? val : currentFolder;

        var folderCls = 'fam';

        if (folderName == 'default') {
            folderCls = 'default';
        }

        if (folderName.length == 2) { //'pt'
            folderCls = folderName;
        }

        if (folderName.length == 5) //'pt-BR'
        {
            folderCls = folderName.substring(3).toLowerCase();
        }


        return count ? 'world': folderCls;
    },

    getFolderPath: function (folderName) {
        return ServerConfig.localizationFolder + '/' + folderName;
    },

    getFilePath: function (folderName, fileName) {
        return ServerConfig.localizationFolder  + '/' + folderName + '/' + fileName;
    }

};


module.exports = LocmanService;
