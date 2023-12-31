/**
 * @license
 * Copyright 2021 Du Tian Wei
 * SPDX-License-Identifier: Apache-2.0
 */
(function () {
    let imgsuffixs = ['.png', '.jpg', '.jpeg'];
    let soundsuffixs = ['.wav', '.mp3'];
    let videosuffixs = ['.mp4'];
    let textsuffixs = ['.txt'];
    OpenBlock.Utils = {
        loadingJS: new Map(),
        loadedJS: [],
        /**
         * 
         * @param {String[]} paths 
         * @returns 
         */
        async loadJSAsync(paths) {
            if (!Array.isArray(paths)) {
                return await OpenBlock.Utils.loadJSAsync([paths]);
            }

            // let allP = paths.map(path => {
            let p;
            paths.forEach(async path => {
                let p1 = p;
                p = new Promise(async (resolve, reject) => {
                    if (p1) {
                        await p1;
                    }
                    if (OpenBlock.Utils.loadedJS.indexOf(path) >= 0) {
                        resolve();
                        return;
                    }
                    let funclst = OpenBlock.Utils.loadingJS.get(path);
                    if (!funclst) {
                        funclst = [];
                        OpenBlock.Utils.loadingJS.set(path, funclst);
                        if (path.endsWith('.mjs')) {
                            import(path).then(module => {
                                OpenBlock.Utils.loadingJS.delete(path);
                                OpenBlock.Utils.loadedJS.push(path);
                                funclst.forEach(f => {
                                    try {
                                        f();
                                    } catch (e) {
                                        console.error(e);
                                    }
                                });
                            });
                        } else {
                            let script = document.createElement('script');
                            script.src = path;
                            script.onload = () => {
                                OpenBlock.Utils.loadingJS.delete(path);
                                OpenBlock.Utils.loadedJS.push(path);
                                funclst.forEach(f => {
                                    try {
                                        f();
                                    } catch (e) {
                                        console.error(e);
                                    }
                                });
                            };
                            script.onerror = reject;
                            script.type = 'text/javascript';
                            document.head.appendChild(script);
                        }
                    }
                    funclst.push(resolve);
                });
            });
            // return Promise.all(allP);
            return await p;
        },
        loadJS(srcs, cb) {
            function loadScript() {
                if (srcs.length === 0) {
                    if (cb) {
                        cb();
                        return;
                    }
                }
                let src = srcs.shift();
                if (src) {
                    let script = document.createElement('script');
                    script.src = src;
                    script.type = 'text/javascript';
                    script.onload = loadScript;
                    script.onerror = (e) => {
                        if (e.currentTarget.src.indexOf('/msg/') < 0
                            && e.currentTarget.src.indexOf('/i18n/') < 0) {
                            console.error(e);
                        }
                        loadScript();
                    }
                    document.head.appendChild(script);
                    //loadScript();
                }
            }
            loadScript();
        },
        // 创建一个带有UTF8 BOM头的Blob对象
        createBlobWithUtf8BOM(str) {
            // 将字符串编码为Uint8Array数组
            const encoder = new TextEncoder();
            const strArray = encoder.encode(str);
            // 创建一个Uint8Array数组，长度为字符串长度加上BOM头长度（2个字节）
            const array = new Uint8Array(strArray.length + 3);
            // 添加BOM头（0xFEFF）到数组开头
            array[0] = 0xEF;
            array[1] = 0xBB;
            array[2] = 0xBF;
            // 将字符串数组复制到新的数组中
            array.set(strArray, 3);
            // 创建一个Blob对象，并返回
            return new Blob([array], { type: 'text/plain;charset=utf-8' });
        },
        delay(ms, throwError) {
            if (throwError) {
                return new Promise(function (resolve, reject) {
                    setTimeout(reject, ms);
                });
            } else {
                return new Promise(function (resolve) {
                    setTimeout(resolve, ms);
                });
            }
        },
        throttle(type, name, obj) {
            obj = obj || window;
            var running = false;
            var func = function () {
                if (running) { return; }
                running = true;
                setTimeout(function () {
                    obj.dispatchEvent(new CustomEvent(name));
                    running = false;
                }, 5);
            };
            obj.addEventListener(type, func);
        },
        canBlockEventSkipSave(e) {
            if (e instanceof Blockly.Events.BubbleOpen) {
                return true;
            }
            if (e instanceof Blockly.Events.ToolboxItemSelect) {
                return true;
            }
            if (e instanceof Blockly.Events.Selected) {
                return true;
            }
            if (e instanceof Blockly.Events.ViewportChange) {
                return true;
            }
            if (e instanceof Blockly.Events.Click) {
                return true;
            }
            if (e instanceof Blockly.Events.BlockDrag) {
                return true;
            }
            if (e instanceof Blockly.Events.BlockCreate) {
                return true;
            }
            return false;
        },
        centerOnSingleBlock(workspace, blockId) {

            const block = blockId ? workspace.getBlockById(blockId) : null;
            if (!block) {
                return;
            }
            // XY is in workspace coordinates.
            const xy = block.getRelativeToSurfaceXY();
            // Find the enter of the block in workspace units.
            const blockCenterY = xy.y + block.height / 2;

            // In RTL the block's position is the top right of the block, not top left.
            const multiplier = workspace.RTL ? -1 : 1;

            const blockCenterX = xy.x + (multiplier * block.width / 2);

            // Workspace scale, used to convert from workspace coordinates to pixels.
            const scale = workspace.scale;
            // Center of block in pixels, relative to workspace origin (center 0,0).
            // Scrolling to here would put the block in the top-left corner of the
            // visible workspace.
            const pixelX = blockCenterX * scale;
            const pixelY = blockCenterY * scale;

            const metrics = workspace.getMetrics();

            // viewHeight and viewWidth are in pixels.
            const halfViewWidth = metrics.viewWidth / 2;
            const halfViewHeight = metrics.viewHeight / 2;

            // Put the block in the center of the visible workspace instead.
            const scrollToCenterX = pixelX - halfViewWidth;
            const scrollToCenterY = pixelY - halfViewHeight;

            // Convert from workspace directions to canvas directions.
            const x = -scrollToCenterX;
            const y = -scrollToCenterY;

            workspace.scroll(x, y);

        },
        requestText(url, callback, async) {
            axios({
                type: 'GET',
                url,
                responseType: 'text',
                async: typeof (async) == 'undefined' ? true : async,
            }).then(({ data }) => {
                callback(data);
            }).catch(err => {
                callback(null, err);
            });
        },
        requestBin(url, callback, async) {
            var oReq = new XMLHttpRequest();
            oReq.open("GET", url, typeof (async) == 'undefined' ? true : async);
            oReq.responseType = "arraybuffer";

            oReq.onload = function (oEvent) {
                var arrayBuffer = oReq.response;
                callback(arrayBuffer);
            };

            oReq.send();
        },
        invalidChar() {
            return "`·￥ ！?~!@#$%^&*()+=`\\/\"'.><,，。;:|\n\r\t？【】{}[]（）";
        },
        isIdentifier(str) {
            if (str == null || str.length == 0) {
                return false;
            }
            if (Number.isInteger(parseInt(str[0]))) {
                return false;
            }
            let c = OpenBlock.Utils.invalidChar();
            for (let i = 0; i < c.length; i++) {
                if (str.indexOf(c[i]) >= 0) {
                    return false;
                }
            }
            return true;
        },
        makeSN() {
            let r = Math.random() * Number.MAX_SAFE_INTEGER;
            let sn = Date.now().toString(36) + "-" + Math.floor(r).toString(36);
            return sn;
        },
        hasName(arr, name) {
            for (let a of arr) {
                if (a.name === name) {
                    return true;
                }
            }
            return false;
        },

        genName(base, checkArr) {
            let postfix = 1, newname = base;
            while (OpenBlock.Utils.hasName(checkArr, newname)) {
                newname = `${base}_${postfix++}`;
            }
            return newname;
        },
        loadProjectFile(projpath, callback) {

            let projRoot = projpath.substring(0, projpath.lastIndexOf('/') + 1);
            OpenBlock.Utils.requestText(projpath, (data, err) => {
                if (err) {
                    callback(OpenBlock.i('工程打开失败！'));
                    return;
                }
                if (!data) {
                    callback(OpenBlock.i('工程打开失败！'));
                    return;
                }
                // data = JSON.parse(data);
                let loading = 0;
                let loadedSrc = [];
                function checkLoaded() {
                    if (loading === 0) {
                        OpenBlock.DataImporter.reorganizeData();
                        try {
                            VFS.partition.src.putAll(loadedSrc);
                        } catch (e) {
                            console.warn(e);
                        }
                        OpenBlock.compileAllSrc(() => {
                            callback();
                        });
                    }
                }
                for (key1 in data) {
                    if (!VFS.partition[key1]) {
                        continue;
                    }
                    let key = key1;
                    let list = data[key];
                    list.forEach(
                        /**
                         * 
                         * @param {String} item 
                         */
                        item => {
                            let i1 = item.lastIndexOf('/');
                            let name;
                            if (i1 >= 0) {
                                name = item.substring(i1 + 1);
                            } else {
                                name = item;
                            }
                            if (item.indexOf('://') === -1) {
                                item = projRoot + item;
                            }
                            if (key === 'src') {
                                loading++;
                                OpenBlock.Utils.requestText(item, (data, err) => {
                                    if (data) {
                                        // let src = JSON.parse(data);
                                        loadedSrc.push({ name: data.name + '.xs', content: data });
                                    } else {
                                        console.warn(err);
                                    }
                                    loading--;
                                    checkLoaded();
                                });
                            } else {
                                let vfs = VFS.partition[key];
                                if (vfs) {
                                    loading++;
                                    if (key === 'config') {
                                        OpenBlock.Utils.requestText(item, (data, err) => {
                                            loading--;
                                            vfs.put(name, data);
                                            checkLoaded();
                                        });
                                    } else {
                                        OpenBlock.Utils.requestBin(item, data => {
                                            loading--;
                                            vfs.put(name, data);
                                            checkLoaded();
                                        });
                                    }
                                }
                            }
                        });
                }
                if (loading === 0) {
                    callback();
                }
            });
        },
        /**
         * 处理hash，认为hash是json内容
         * @param {function} onloading 
         * @param {function(error,bool)} onloaded 
         */
        handleUrlHash(onloading, onloaded) {
            if (window.location.hash) {
                let hash = window.location.hash;
                if (hash.length > 0) {
                    hash = hash.substring(1);
                    hash = decodeURIComponent(hash);
                    let hashobj = JSON.parse(hash);
                    // 处理 proj参数
                    if (hashobj.proj) {
                        onloading();
                        OpenBlock.Utils.loadProjectFile(hashobj.proj, () => { onloaded(null, true); });
                    } else if (hashobj.srczip) {
                        axios.get(hashobj.srczip, {
                            responseType: 'arraybuffer', // default
                        }).then(({ data }) => {
                            OpenBlock.importProjectZip(data, () => { onloaded(null, true) });
                        }).catch(e => {
                            onloaded(e);
                        });
                    } else {
                        onloaded(null, false);
                    }
                }
            } else {
                onloaded(null, false);
            }
        },
        /**
         *   let url= arrayBufferToBase64(response);
         *   document.getElementById('img').src='data:image/jpeg;base64,'+url;
         * @param {ArrayBuffer} buffer 
         * @returns 
         */
        arrayBufferToBase64(buffer) {
            var binary = '';
            var bytes = new Uint8Array(buffer);
            var len = bytes.byteLength;
            for (var i = 0; i < len; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            return window.btoa(binary);
        },
        base64ToArrayBuffer(base64) {
            // 解码Base64字符串  
            var binary = atob(base64);

            // 创建一个Uint8Array，其中包含我们的二进制数据  
            var arrayBuffer = new Uint8Array(binary.length);

            // 将每个字符转换为对应的字节  
            for (var i = 0; i < binary.length; i++) {
                arrayBuffer[i] = binary.charCodeAt(i);
            }

            return arrayBuffer.buffer;
        },
        /**
         * 
         * @param {String} name 
         * @param {String[]} suffixs 
         * @returns 
         */
        endsWith(name, suffixs) {
            name = name.toLowerCase();
            for (i = 0; i < suffixs.length; i++) {
                if (name.endsWith(suffixs[i])) {
                    return true;
                }
            }
            return false;
        },
        soundsuffixs, imgsuffixs, videosuffixs, textsuffixs,
        topBlockType: [
            'on_event', 'on_message', 'on_message_struct', 'on_message_primary',
            'on_message_with_arg', 'typed_procedures', 'struct'
        ],
        /**
         * 
         * @param {String} name 必须小写
         * @returns 
         */
        mediaType(name) {
            /**
             * @type String
             */
            if (OpenBlock.Utils.endsWith(name, soundsuffixs)) {
                return 'sound';
            }
            if (OpenBlock.Utils.endsWith(name, imgsuffixs)) {
                return 'image';
            }
            if (OpenBlock.Utils.endsWith(name, videosuffixs)) {
                return 'video';
            }
            if (OpenBlock.Utils.endsWith(name, textsuffixs)) {
                return 'text';
            }
            console.warn('Unknown mediaType:' + name);
            return 'Unknown';
        },
        /**
         * 
         * @param {String} filename 必须小写
         * @returns 
         */
        fileType(filename) {
            let idx = filename.lastIndexOf('.');
            if (idx >= 0) {
                return filename.substring(idx);
            } else {
                return "";
            }
        },
        eventsSkippedSaving: [
            Blockly.Events.UI,
            Blockly.Events.BLOCK_DRAG,
            Blockly.Events.SELECTED,
            Blockly.Events.CLICK,
            Blockly.Events.BUBBLE_OPEN,
            Blockly.Events.TRASHCAN_OPEN,
            Blockly.Events.TOOLBOX_ITEM_SELECT,
            Blockly.Events.THEME_CHANGE,
            Blockly.Events.VIEWPORT_CHANGE,
        ],

    };
})();