/**
 * @license
 * Copyright 2021 Du Tian Wei
 * SPDX-License-Identifier: Apache-2.0
 */

import { defineAsyncComponent } from 'vue';
let obDatasetSider = defineAsyncComponent(async () => {
    await OpenBlock.onInitedPromise();
    let template = (await axios({
        url: 'js/htmls/dataset/htmls.html',
        responseType: 'text'
    })).data;
    while (!OpenBlock.DataImporter) {
        await OpenBlock.Utils.delay(100);
    }
    return {
        data: function () {
            return {
                compiledData: {},
                files: []
            }
        },
        template,
        methods: {
            update() {
                this.compiledData = OpenBlock.DataImporter.dataReorganizingContext.compiled;
                VFS.partition.data.allFiles((files) => {
                    this.files = files.map(f => f.name);
                });
            },
            downloadFile(file) {
                VFS.partition.data.get(file, (f) => {
                    FileOD.Save(file, new Blob([f]));
                });
            },
            removeFile(file) {
                VFS.partition.data.delete(file);
            },
            importData: function () {

                FileOD.Open('.xlsx', 'ArrayBuffer',
                    /**
                     * 
                     * @param {{name:String,content:ArrayBuffer}[]} arrayBufferArray 
                     */
                    (arrayBufferPair) => {
                        // OpenBlock.DataImporter.excel.import(arrayBufferPair);
                        // OpenBlock.DataImporter.reorganizeData();
                        // arrayBufferPair.forEach(pair=>{
                        //     VFS.partition.data.put(pair.name,pair.content)
                        // });
                        VFS.partition.data.putAll(arrayBufferPair);
                    }, true);
            },
            clearData() {
                // OpenBlock.DataImporter.cleanData();
                VFS.partition.data.deleteAll();
            },
            openDataTab(tableName) {
                OB_IDE.openFile('dataset', tableName, this.compiledData[tableName]);
                OB_IDE.closeSider();
            }
        },
        mounted() {
            OpenBlock.DataImporter.addEventListener('dataUpdate', () => {
                this.update();
            });
            VFS.partition.data.on('changed', () => {
                this.update();
            });
        }
    };
}
);
export default obDatasetSider