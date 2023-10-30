/**
 * @license
 * Copyright 2021 Du Tian Wei
 * SPDX-License-Identifier: Apache-2.0
 */

import { defineAsyncComponent, markRaw, toRaw, reactive } from 'vue';
import SceneManager from '../../../core/ub/SceneManager.mjs';
OpenBlock.onInited(() => {
    let sceneManager = reactive(SceneManager);
    let SceneManagerComponent = defineAsyncComponent(() => {
        return new Promise((resolve, reject) => {
            axios({
                url: 'js/htmls/SceneManager/SceneManager.html',
                responseType: 'text',
                async: false
            }).then(({ data }) => {
                let colors = markRaw(Blockly.FieldColour.COLOURS);
                let colorNames = markRaw(Blockly.FieldColour.TITLES);
                resolve({
                    // 为了支持外部注入的扩展。这里需要一个不需要的data，以避免警告。
                    props: ['data'],
                    template: data,
                    name: 'SceneManagerUI',
                    data() {
                        return {
                            manager: sceneManager,
                            rawScene: null,
                            editingScene: false,
                            editedScene: null,
                            colors,
                            colorNames,
                            selectedColorIdx: null,
                            selectedColorName: null,
                            selectedSceneIdx: 0,
                            showColorSelector: false,
                            showSceneList: false,
                            fixButton: true,
                            sceneListCardXOffset: 0,
                            running: new Map()
                        };
                    },
                    methods: {
                        async runProject(r, s) {
                            if (r) {
                                if (this.running.has(r)) {
                                    this.$Message.warning(this.$t('正在运行，请稍后'));
                                    return;
                                }
                                this.running.set(r, s);
                                try {
                                    await r(toRaw(s));
                                } finally {
                                    this.running.delete(r);
                                }
                            } else {
                                this.$Message.warning({
                                    background: true,
                                    content: this.$t('未设定运行方式')
                                });
                            }
                        },
                        removeScene(s) {
                            let id = s.id;
                            let ss = this.manager.scenes[this.selectedSceneIdx];
                            this.manager.removeScene(id);
                            if (ss.id !== id) {
                                let idx = this.manager.scenes.indexOf(ss);
                                if (idx >= 0) {
                                    this.selectedSceneIdx = idx;
                                } else {
                                    this.selectedSceneIdx = 0;
                                }
                            }
                            if (this.manager.scenes.length == 1) {
                                this.hideList();
                            }
                        },
                        moveToTop(i) {
                            this.selectedSceneIdx = i;
                            this.hideList();
                        },
                        toggleList() {
                            if (this.showSceneList) {
                                this.hideList();
                            } else {
                                this.showList();
                            }
                        },
                        showList() {
                            this.showSceneList = true;
                            let target = this.$refs.sceneBtns;
                            let rect = target.getBoundingClientRect();
                            this.sceneListCardXOffset = rect.left - 13;
                            this.fixButton = false;
                            setTimeout(() => {
                                this.fixButton = true;
                            }, 500);
                        },
                        hideList() {
                            this.showSceneList = false;
                        },
                        async newScene(sceneTemplate) {
                            let scene = sceneManager.createScene(sceneTemplate);
                            // { env: sceneTemplate.env, baseName: sceneTemplate.name };
                            if (sceneTemplate.beforeCreate) {
                                scene = await sceneTemplate.beforeCreate(scene);
                                if (!scene) {
                                    return;
                                }
                            }
                            this.editScene(scene, this._useScene);
                        },
                        _useScene(ok, scene) {
                            if (!ok) {
                                return;
                            }
                            this.manager.applyScene(scene);
                        },
                        editScene_(scene) {
                            this.editScene(scene, (apply, scene) => {
                                if (apply) {
                                    this.manager.applyScene(scene);
                                }
                            });
                        },
                        isExist(sceneid) {
                            return !!sceneManager.getScene(sceneid);
                        },
                        editScene(scene, callback) {
                            this.showColorSelector = false;
                            this.onFinished = callback;
                            this.rawScene = scene;
                            this.editedScene = JSON.parse(JSON.stringify(scene));
                            this.editedScene.id = scene.id || Math.floor(Math.random() * 58786559 + 1679616).toString(36)
                            this.editedScene.name = scene.name || this.$t(this.editedScene.env) + '-' + this.editedScene.id;
                            this.editedScene.config = scene.config || {};
                            this.editedScene.srcList = scene.srcList || [];
                            this.editedScene.entry = scene.entry;
                            if (scene.color) {
                                this.selectedColorIdx = scene.color ? Blockly.FieldColour.COLOURS.indexOf(scene.color) : Math.floor(Math.random() * Blockly.FieldColour.COLOURS.length);
                                this.selectedColorName = Blockly.FieldColour.TITLES[this.selectedColorIdx];
                                this.editedScene.color = scene.color || Blockly.FieldColour.COLOURS[this.selectedColorIdx];
                                this.editedScene.config = scene.config || {};
                            } else {
                                this.randomColor();
                            }
                            this.editingScene = true;
                        },
                        randomColor() {
                            this.selectedColorIdx = Math.floor(Math.random() * Blockly.FieldColour.COLOURS.length);
                            this.selectedColorName = Blockly.FieldColour.TITLES[this.selectedColorIdx];
                            this.editedScene.color = Blockly.FieldColour.COLOURS[this.selectedColorIdx];
                        },
                        finish(ok, scene) {
                            if (ok) {
                                if (this.hasError()) {
                                    return false;
                                }
                            }
                            this.onFinished(ok, toRaw(scene));
                            this.editingScene = false;
                        },
                        changeColor(c, i) {
                            this.editedScene.color = c;
                            this.selectedColorIdx = i;
                            this.selectedColorName = Blockly.FieldColour.TITLES[this.selectedColorIdx];
                        },
                        runMethods(scene) {
                            if (scene) {
                                let baseName = scene.baseName;
                                let sceneInfo = this.manager.getAvailableScene(baseName);
                                if (sceneInfo) {
                                    return sceneInfo.runMethods;
                                }
                            }
                        },
                        nameError() {
                            let os = this.manager.getSceneByName(this.editedScene.name);
                            if (os && os.id != this.editedScene.id) {
                                return '名称已存在';
                            }
                        },
                        hasError() {
                            return !!this.nameError();
                        }
                    },
                    computed: {
                    },
                    mounted() {
                        OpenBlock.VFS.partition.config.on('changed', () => {
                            this.manager.load();
                            let m = this.manager;
                            this.manager = null;
                            this.manager = m;
                        });

                    }
                });
            });
        })
    });

    let rSceneManagerComponent = markRaw(SceneManagerComponent);
    OB_IDE.addToolbarItem({ component: rSceneManagerComponent, index: 1000, name: 'addScene' });
});