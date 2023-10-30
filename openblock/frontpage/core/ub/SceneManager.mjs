
class SceneManager {
    constructor() {
        let sceneManager = this;
        OpenBlock.onInited(() => {
            sceneManager._init();
            OpenBlock.Env.onChange(() => {
                sceneManager._updateAvailableScenes();
            });
        });
    }

    availableScenes = [];
    scenes = [];
    _updateAvailableScenes() {
        // let scenes = [];
        // this.availableScenes.forEach((v) => {
        //     let scene = this.scenes.find((s) => s.name == v.name);
        //     if (!scene) {
        //         if (OpenBlock.Env.hasEnv(v.env)) {
        //             scenes.push(v);
        //         }
        //     }
        // });
        // this.scenes = scenes;
    }
    isSceneAvailable(sceneName) {
        return !!this.availableScenes.find(s => s.name == sceneName);
    }
    getAvailableScene(sceneName) {
        return this.availableScenes.find(s => s.name == sceneName);
    }
    addAvailableScene(scene) {
        if (this.isSceneAvailable(scene.name)) {
            throw new Error('场景已存在');
        }
        this.availableScenes.push(scene);
        this._updateAvailableScenes();
    }
    addAvailableScenes(scenes) {
        scenes.forEach(s => {
            this.addAvailableScene(s);
        });
    }
    removeAvailableScenes(sceneName) {
        this.availableScenes.remove(sceneName);
        this._updateAvailableScenes();
    }
    _init() {
    }
    load() {
        OpenBlock.VFS.partition.config.get('scenes.json', j => {
            if (j) {
                this.scenes = j;
            }
        });
    }
    save() {
        OpenBlock.VFS.partition.config.put('scenes.json', this.scenes);
    }
    createScene(sceneTemplate) {
        let id = Math.floor(Math.random() * 58786559 + 1679616).toString(36)
        let scene = {
            id,
            env: sceneTemplate.env,
            baseName: sceneTemplate.name,
            name: OpenBlock.i(sceneTemplate.env) + '-' + id,
            config: {},
            srcList: [],
            entry: null,
            color: Blockly.FieldColour.COLOURS[Math.floor(Math.random() * Blockly.FieldColour.COLOURS.length)]
        };
        return scene;
    }
    applyScene(scene) {
        let baseName = scene.baseName;
        let template = this.getAvailableScene(baseName);
        if (template && template.beforeUpdate) {
            scene = template.beforeUpdate(scene);
            if (!scene) {
                return;
            }
        }
        let idx = this.scenes.findIndex(s => s.id == scene.id);
        if (idx >= 0) {
            this.scenes[idx] = scene;
        } else {
            if (this.scenes.find(s1 => s1.name == scene.name)) {
                throw Error('名称已存在');
            }
            this.scenes.push(scene);
        }
        this.save();
    }
    getScene(id) {
        return this.scenes.find(s => s.id == id);
    }
    getSceneByName(name) {
        return this.scenes.find(s => s.name == name);
    }
    removeScene(id) {
        let idx = this.scenes.findIndex(s => s.id == id);
        if (idx >= 0) {
            this.scenes.splice(idx, 1);
        }
        this.save();
    }
    scenesWithSrc(srcName) {
        let lst = this.scenes.filter(s => s.srcList.indexOf(srcName) >= 0);
        return lst;
    }
    sceneIDsWithSrc(srcName) {
        let lst = this.scenesWithSrc(srcName);
        return lst.map(i => i.id);
    }
    setEntry(sceneID, entryName) {
        let s = this.getScene(sceneID);
        if (s) {
            s.entry = entryName;
            this.save();
        }
    }
    getEntry(sceneID) {
        let s = this.getScene(sceneID);
        if (s) {
            return s.entry;
        }
    }

    linkSrcToScenes(srcName, sceneIDs) {
        this.scenes.forEach(scene => {
            if (sceneIDs.indexOf(scene.id) >= 0) {
                // 关联
                if (scene.srcList.indexOf(srcName) <= 0) {
                    scene.srcList.push(srcName);
                }
            } else {
                // 取消关联
                let idx = scene.srcList.indexOf(srcName);
                if (idx >= 0) {
                    scene.srcList.splice(idx, 1);
                }
            }
        });
        this.save();
    }
    unlinkSrcFromAllScenes(srcName) {
        this.scenes.forEach(scene => {
            let idx = scene.srcList.indexOf(srcName);
            if (idx >= 0) {
                scene.srcList.splice(idx, 1);
            }
        });
        this.save();
    }
    filterSameSceneWith(sceneIds, lst) {
        let result = [...lst];
        this.scenes.forEach(s => {
            if (sceneIds.indexOf(s.id) >= 0) {
                for (let i = result.length - 1; i >= 0; i--) {
                    let src = result[i];
                    if (s.srcList.indexOf(src) < 0) {
                        result.splice(i, 1);
                    }
                };
            }
        });
        return result;
    }
    updateEntry(fsmName, newName) {
        let changed = false;
        this.scenes.forEach(s => {
            if (s.entry == fsmName) {
                s.entry = newName;
                changed = true;
            }
        });
        if (changed) {
            this.save();
        }
    }
}
export default SceneManager = new SceneManager();