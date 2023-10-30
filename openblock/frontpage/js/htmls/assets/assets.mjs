
/**
 * @license
 * Copyright 2022 Du Tian Wei
 * SPDX-License-Identifier: Apache-2.0
 */
import Compressor from '../../../3rd/compressor.esm.js';
import { defineAsyncComponent, defineComponent } from 'vue';
export default defineAsyncComponent(async () => {

    //**blob to dataURL**
    function blobToDataURL(blob, callback) {
        var a = new FileReader();
        a.onload = function (e) { callback(e.target.result); }
        a.readAsDataURL(blob);
    }
    let [htmlTemplate, imageTemplate] = await Promise.all([
        axios({
            url: 'js/htmls/assets/htmls.html',
            responseType: 'text'
        }),
        axios({ url: 'js/htmls/assets/image.html', responseType: 'text' }),
        OpenBlock.onInitedPromise()
    ]);
    let acceptType = [
        OpenBlock.Utils.imgsuffixs.join(','),
        OpenBlock.Utils.soundsuffixs.join(','),
        OpenBlock.Utils.videosuffixs.join(','),
        OpenBlock.Utils.textsuffixs.join(',')
    ].join(',');
    VFS.partition.assets = new VFS(new VFSMemoryCache());
    let assetitemimage = defineComponent({
        name: 'assetItemImage',
        template: imageTemplate.data,
        props: ['file'],
        data() {
            return {
                showResizeWindow: false,
                resizeWidth: 0,
                resizeHeight: 0,
                quality: 0.6,
                resizedFileSize: 0,
                resizedSrc: "",
                resizedFile: null,
            };
        },
        mounted() {
        },
        watch: {
            resizeWidth() {
                this.doResize();
            },
            resizeHeight() {
                this.doResize();
            },
            quality() {
                this.doResize();
            },
            showResizeWindow(v) {
                if (v) {
                    this.doResize();
                }
            }
        },
        computed: {
            makeSrc() {
                let base64 = OpenBlock.Utils.arrayBufferToBase64(this.file.content);
                let fileType = this.file.fileType.substring(1);
                return 'data:image/' + fileType + ';base64,' + base64;
            },
        },
        methods: {
            save() {
                OpenBlock.VFS.partition.assets.put(this.file.name, this.resizedFile);
            },
            doResize() {
                if (!this.showResizeWindow) {
                    return;
                }
                let that = this;
                new Compressor(new Blob([this.file.content], { type: 'image/png' }), {
                    quality: this.quality,
                    maxHeight: this.resizeHeight,
                    maxWidth: this.resizeWidth,
                    error(err) {
                        console.log(err.message);
                    },
                    success(blob) {
                        blob.arrayBuffer().then((ab) => {
                            that.resizedFile = ab;
                        });
                        blobToDataURL(blob, (url) => {
                            that.resizedSrc = url;
                            that.resizedFileSize = Math.round(blob.size / 1024)
                        });
                    }
                });
            },
            resize() {
                this.resizeWidth = this.$refs.origin.naturalWidth;
                this.resizeHeight = this.$refs.origin.naturalHeight;
                this.showResizeWindow = true;
            },
        }
    });
    return {
        name: 'assets',
        components: {
            assetitemimage
        },
        data() {
            return {
                enabled: true,
                search: {
                    name: "",
                    types: ['image', 'sound', 'video', 'text']
                },
                assetsList: [],
            }
        },
        template: htmlTemplate.data,
        methods: {
            searchResult(file) {
                if (file.name.indexOf(this.search.name) == -1) {
                    return false;
                }
                if (this.search.types.indexOf(file.mediaType) > -1) {
                    return true;
                }
                return false;
            },
            uploadFiles() {
                FileOD.Open(acceptType, 'ArrayBuffer', (arrayBufferArray) => {
                    VFS.partition.assets.putAll(arrayBufferArray);
                }, true);
            },
            addFiles(filelist) {

                filelist.forEach(file => {
                    let item = this.assetsList.find(i => i.name === file.name);
                    if (item) {
                        item.content = file.content;
                        item.size = Math.round(file.content.byteLength / 1024);
                    } else {
                        item = { name: file.name, content: file.content, size: Math.round(file.content.byteLength / 1024) };
                        this.assetsList.push(item);
                        /**
                         * @type {String}
                         */
                        let filename = file.name;
                        filename = filename.toLowerCase();
                        item.mediaType = OpenBlock.Utils.mediaType(filename);
                        item.fileType = OpenBlock.Utils.fileType(filename);
                        item.component = 'assetitem' + item.mediaType;
                    }
                });
            },
            deleteFile(filename) {
                VFS.partition.assets.delete(filename);
            }
        },
        mounted() {
            let assetsvfs = VFS.partition.assets;
            assetsvfs.allFiles(filelist => {
                this.addFiles(filelist);
            });
            assetsvfs.on('put', (filelist) => {
                this.addFiles(filelist);
            });
            assetsvfs.on('delete', (fileinfo) => {
                let idx = this.assetsList.findIndex(i => i.name === fileinfo.name);
                if (idx >= 0) {
                    this.assetsList.splice(idx, 1);
                }
            });
            assetsvfs.on('deleteAll', () => {
                this.assetsList = [];
            });
        }
    };
});