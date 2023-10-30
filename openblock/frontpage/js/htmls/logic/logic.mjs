
import { defineAsyncComponent, nextTick, toRaw } from 'vue';
import SceneIcon from "../SceneManager/SceneIcon.mjs";
import SceneManager from '../../../core/ub/SceneManager.mjs';
const Logic = defineAsyncComponent(() => {
    return new Promise((resolve, reject) => {
        axios({
            url: 'js/htmls/logic/htmls.html',
            responseType: 'text'
        }).then(({ data }) => {
            OpenBlock.onInited(() => {
                VFS.partition.config.put('project.json', { name: '' });
                let template = data;
                let obLogicSider = {
                    components: { SceneIcon },
                    name: 'LogicPanel',
                    data: function () {
                        let data = {
                            SceneManager,
                            chartWindowTitle: null,
                            showChart: false,
                            chart: null,
                            fsmCreateSeries: null,
                            currentScene: null,
                            env: [],
                            showSrcEditWindow: false,
                            editingSrc: { src: {}, env: [] },
                            scenesOfEditingSrc: null
                        };
                        return data;
                    },
                    computed: {
                        isUniversal() {
                            return this.editingSrc.env.length === 0;
                        },
                        isScene() {
                            return this.currentScene && this.currentScene.startsWith('scene/');
                        }
                    },
                    methods: {
                        async renameActionGroup(fsm, actiongroup) {
                            let v = await this.$root.prompt(OpenBlock.i("重命名行为组"), actiongroup.name);
                            if (v) {
                                if (typeof (v) == 'string') {
                                    if (v === actiongroup.name) {
                                        return;
                                    }
                                    let check = fsm.functions.find(o => o.name === v);
                                    if (check) {
                                        nextTick(() => {
                                            this.$Modal.error({
                                                title: OpenBlock.i("错误"),
                                                content: OpenBlock.i("该名称已存在")
                                            });
                                        });
                                    } else if (!OpenBlock.Utils.isIdentifier(v)) {
                                        // this.waring = OpenBlock.i('不能包含符号');
                                        nextTick(() => {
                                            this.$Modal.error({
                                                title: OpenBlock.i("错误"),
                                                content: OpenBlock.i("不能包含符号")
                                            });
                                        });
                                    } else {
                                        actiongroup.name = v;
                                        OpenBlock.saveAllSrc();
                                        OpenBlock.BlocklyParser.analyze();
                                        OpenBlock.compileAllSrc();
                                    }
                                }
                            };
                        },
                        refresh() {
                            let currentScene = this.currentScene;
                            this.currentScene = {};
                            this.currentScene = currentScene;
                        },
                        srcCntOfScene(scene) {
                            let srcs = OpenBlock.BlocklyParser.loadedFiles.srcs;
                            let srcList = scene.srcList;
                            let result = srcs.filter(s => srcList.indexOf(s.name) >= 0);
                            return result.length;
                        },
                        checkName(evt) {
                            let v = evt.target.value;
                            if (v.length == 0) {
                                return;
                            }
                            if (!OpenBlock.Utils.isIdentifier(v)) {
                                // this.waring = OpenBlock.i('不能包含符号');
                                let lv = evt.target._value;
                                setTimeout(() => {
                                    this.editingSrc.name = lv;
                                }, 0);
                            }
                        },
                        availableModule(moduleName, env, scenes) {
                            if (!moduleName) {
                                return [];
                            }
                            let lst = OpenBlock.BlocklyParser.loadedFiles.dependingTree.availableModule(moduleName, env);
                            let lst1 = this.SceneManager.filterSameSceneWith(scenes, lst);
                            return lst1;
                        },
                        setUniversal(u) {
                            this.editingSrc.env = [];
                        },
                        unavalibleModule(moduleName, env) {
                            if (!moduleName) {
                                return [];
                            }
                            return OpenBlock.BlocklyParser.loadedFiles.dependingTree.unavailableModule(moduleName, env);
                        },
                        saveSrcFile: function (src1) {
                            OpenBlock.saveAllSrc(() => {
                                VFS.partition.src.get(src1.name + '.xs', (src, name) => {
                                    OpenBlock.serializeSrc(src, (e, src_str) => {
                                        if (e) {
                                            throw e;
                                        }
                                        FileOD.Save(name, src_str);
                                    });
                                });
                            });
                        },
                        addFSM: function (src) {
                            OpenBlock.addFSM(src);
                        },
                        removeFSMState: function (fsm, v) {
                            this.$Modal.confirm({
                                title: OpenBlock.i('删除'),
                                content: `<p>删除状态 ${v.name}</p>`,
                                onOk() {
                                    OpenBlock.removeFSMState(fsm, v);
                                    OpenBlock.compileAllSrc();
                                }
                            });
                        },
                        removeStruct(src, struct) {
                            this.$Modal.confirm({
                                title: OpenBlock.i('删除'),
                                content: `<p>删除数据结构 ${struct.name}</p>`,
                                onOk() {
                                    OpenBlock.removeStruct(src, struct);
                                    OpenBlock.compileAllSrc();
                                }
                            });
                        },
                        addFSMState: function (fsm) {
                            let state = OpenBlock.addState(fsm);
                        },
                        addStruct: function (src) {
                            if (src && src.structs) {
                                let dt = OpenBlock.addStruct(src);
                            }
                        },
                        addFunction: function (src) {
                            if (src && src.functions) {
                                let f = OpenBlock.addFunction(src);
                            }
                        },
                        addFSMActionGroup(fsm) {
                            let g = OpenBlock.addFSMActionGroup(fsm);
                        },
                        removeFunction(s, f) {
                            this.$Modal.confirm({
                                title: OpenBlock.i('删除'),
                                content: `<p>删除函数 ${f.name}</p>`,
                                onOk() {
                                    OpenBlock.removeFunction(s, f);
                                    OpenBlock.compileAllSrc();
                                }
                            });
                        },
                        removeFSM: function (src, fsm) {
                            let self = this;
                            this.$Modal.confirm({
                                title: OpenBlock.i('删除'),
                                content: `<p>删除${OpenBlock.i('FSM')}类型 ${fsm.name}</p>`,
                                onOk() {
                                    OpenBlock.removeFSM(src, fsm);
                                    OpenBlock.compileAllSrc();
                                    self.refresh();
                                }
                            });
                        },
                        async renameFSM(src, fsm) {
                            let v = await this.$root.prompt(OpenBlock.i(`重命名${OpenBlock.i('FSM')}类型`), fsm.name);
                            if (v) {
                                if (v === fsm.name) {
                                    return;
                                }
                                let check = src.fsms.find(_fsm => _fsm.name === v);
                                if (check) {
                                    nextTick(() => {
                                        this.$Modal.error({
                                            title: OpenBlock.i("错误"),
                                            content: OpenBlock.i("该名称已存在")
                                        });
                                    });
                                } else if (!OpenBlock.Utils.isIdentifier(v)) {
                                    // this.waring = OpenBlock.i('不能包含符号');
                                    nextTick(() => {
                                        this.$Modal.error({
                                            title: OpenBlock.i("错误"),
                                            content: OpenBlock.i("不能包含符号")
                                        });
                                    });
                                } else {
                                    SceneManager.updateEntry(src.name + '.' + fsm.name, src.name + '.' + v);
                                    fsm.name = v;
                                    OpenBlock.saveAllSrc();
                                    OpenBlock.compileAllSrc();
                                }
                            }
                        },
                        renameState: async function (fsm, state) {
                            let v = await this.$root.prompt(OpenBlock.i("重命名状态"), state.name);
                            if (v) {
                                if (typeof (v) == 'string') {

                                    if (v === state.name) {
                                        return;
                                    }
                                    let check = fsm.states.find(o => o.name === v);
                                    if (check) {
                                        nextTick(() => {
                                            this.$Modal.error({
                                                title: OpenBlock.i("错误"),
                                                content: OpenBlock.i("该名称已存在")
                                            });
                                        });
                                    } else if (!OpenBlock.Utils.isIdentifier(v)) {
                                        // this.waring = OpenBlock.i('不能包含符号');
                                        nextTick(() => {
                                            this.$Modal.error({
                                                title: OpenBlock.i("错误"),
                                                content: OpenBlock.i("不能包含符号")
                                            });
                                        });
                                    } else {
                                        state.name = v;
                                        OpenBlock.saveAllSrc();
                                        OpenBlock.compileAllSrc();
                                    }
                                }
                            };
                        },
                        renameStruct: async function (src, st) {
                            let v = await this.$root.prompt("重命名数据结构", st.name);
                            if (v) {
                                if (v) {
                                    if (v === st.name) {
                                        return;
                                    }
                                    let check = src.structs.find(o => o.name === v);
                                    if (check) {
                                        nextTick(() => {
                                            this.$Modal.error({
                                                title: OpenBlock.i("错误"),
                                                content: OpenBlock.i("该名称已存在")
                                            });
                                        });
                                    } else if (!OpenBlock.Utils.isIdentifier(v)) {
                                        // this.waring = OpenBlock.i('不能包含符号');
                                        nextTick(() => {
                                            this.$Modal.error({
                                                title: OpenBlock.i("错误"),
                                                content: OpenBlock.i("不能包含符号")
                                            });
                                        });
                                    } else {
                                        st.name = v;
                                        OpenBlock.saveAllSrc();
                                        OpenBlock.compileAllSrc();
                                    }
                                }
                            };
                        },
                        renameFunction: async function (src, st) {
                            let v = await this.$root.prompt(OpenBlock.i("重命名函数组"), st.name);
                            if (v) {
                                if (v) {
                                    if (v === st.name) {
                                        return;
                                    }
                                    let check = src.functions.find(o => o.name === v);
                                    if (check) {
                                        nextTick(() => {
                                            this.$Modal.error({
                                                title: OpenBlock.i("错误"),
                                                content: OpenBlock.i("该名称已存在")
                                            });
                                        });
                                    } else if (!OpenBlock.Utils.isIdentifier(v)) {
                                        // this.waring = OpenBlock.i('不能包含符号');
                                        nextTick(() => {
                                            this.$Modal.error({
                                                title: OpenBlock.i("错误"),
                                                content: OpenBlock.i("不能包含符号")
                                            });
                                        });
                                    } else {
                                        st.name = v;
                                        OpenBlock.saveAllSrc();
                                        OpenBlock.compileAllSrc();
                                    }
                                }
                            };
                        },
                        setStartState: function (fsm, state) {
                            let index = fsm.states.indexOf(state);
                            if (index != 0) {
                                let startState = fsm.states[0];
                                fsm.states[index] = startState;
                                fsm.states[0] = state;
                            }
                            OpenBlock.saveAllSrc();
                        },
                        loadFiles: function () {
                            // FileInterface.loadSrcFiles(() => {
                            //     OpenBlock.compileAllSrc();
                            // });

                            let _loadFiles = (files, cb) => {
                                let parsedFile = [];
                                let errors = [];

                                function checkFinish() {
                                    if (parsedFile.length + errors.length === files.length) {
                                        if (errors.length > 0) {
                                            throw new Error(errors);
                                        }
                                        try {
                                            VFS.partition.src.putAll(parsedFile);
                                        } catch (e) {
                                            console.error(e);
                                        }
                                        if (typeof (cb) === 'function') {
                                            cb(parsedFile)
                                        }
                                    }
                                }
                                files.forEach((f) => {
                                    // let fname = f.name.toLowerCase();
                                    let reader = new FileReader();
                                    reader.readAsText(f);
                                    reader.onloadend = (evt) => {
                                        try {
                                            let json = JSON.parse(evt.target.result);
                                            if (json.type === 'src' || json.type === 'lib') {
                                                parsedFile.push({ name: json.name + '.xs', content: json });
                                            } else {
                                                throw new Error(`未知文件类型:${json.name}-${json.type}`);
                                            }
                                        } catch (e) {
                                            errors.push(e);
                                        }
                                        checkFinish();
                                    };
                                });
                            };
                            FileOD.Open('.xs,.xl', 'File', (files) => {
                                files = Object.values(files);
                                _loadFiles(files, () => {
                                    OpenBlock.compileAllSrc();
                                });
                            }, true);
                        },
                        unloadFile: function (file) {
                            this.$Modal.confirm({
                                title: OpenBlock.i('删除模块'),
                                content: `<p>是否删除模块 ${file.name}</p>`,
                                onOk() {
                                    let moduleName = file.name;
                                    for (let idx in VFS.partition.src._storage.datas) {
                                        let fileInfo = VFS.partition.src._storage.datas[idx];
                                        if (fileInfo.name === moduleName) {
                                            VFS.partition.src.delete(idx);
                                            break;
                                        }
                                    }
                                    OpenBlock.compileAllSrc();
                                }
                            });
                        },
                        newFile: function (env, scenes) {
                            return new Promise((res, rej) => {
                                OpenBlock.newSrc(env ? {
                                    "env": env
                                } : {}, (opt) => {
                                    if (opt) {
                                        SceneManager.linkSrcToScenes(opt.name, scenes);
                                        res(opt);
                                    } else {
                                        rej();
                                    }
                                });
                            });
                        },
                        editSrc(src) {
                            this.showSrcEditWindow = false;
                            nextTick(() => {
                                let newDeps = [...src.depends];
                                let editingSrc = {
                                    src,
                                    warning: null,
                                    name: src.name,
                                    depends: newDeps,
                                    env: [...src.env]
                                };
                                this.editingSrc = editingSrc;
                                this.scenesOfEditingSrc = SceneManager.sceneIDsWithSrc(src.name);
                                this.showSrcEditWindow = true;
                                this.$forceUpdate();
                            });
                        },
                        submitEditingSrc() {
                            let editingSrc = this.editingSrc;
                            if (!editingSrc.name) {
                                editingSrc.warning = OpenBlock.i("需要指定模块名称");
                                return;
                            }
                            let src = toRaw(editingSrc.src);
                            if (src.name != editingSrc.name) {
                                let check =
                                    OpenBlock.BlocklyParser.loadedFiles.srcs.find(s => (s.name === editingSrc.name));
                                if (check) {
                                    editingSrc.warning = OpenBlock.i("模块名称冲突");
                                    return;
                                }
                                let oldName = src.name;
                                VFS.partition.src.delete(oldName + '.xs');
                                SceneManager.unlinkSrcFromAllScenes(oldName);
                                src.name = editingSrc.name;
                            }
                            this.showSrcEditWindow = false;
                            this.editingSrc = { src: {}, env: [] };

                            src.depends = [...editingSrc.depends];
                            src.env = [...editingSrc.env];
                            VFS.partition.src.put(src.name + '.xs', src);
                            SceneManager.linkSrcToScenes(src.name, this.scenesOfEditingSrc);
                            OpenBlock.BlocklyParser.updateDepends();
                            this.$forceUpdate();
                            OpenBlock.compileAllSrc();
                        },
                        cleanEditingSrc() {
                            this.showSrcEditWindow = false;
                            this.editingSrc = { src: {}, env: [] };
                            this.scenesOfEditingSrc = null;
                        },
                        setEntry(name) {
                            if (this.currentScene.startsWith('scene/')) {
                                let id = this.currentScene.substring(6);
                                SceneManager.setEntry(id, name);
                            }
                        },
                        getEntry() {
                            if (this.currentScene.startsWith('scene/')) {
                                let id = this.currentScene.substring(6);
                                return SceneManager.getEntry(id);
                            }
                        },
                        FSMNamesInScene(env) {
                            let srcs = this.filteredSrc(env);
                            let names = [];
                            for (let src of srcs) {
                                for (let fsm of src.fsms) {
                                    names.push(src.name + '.' + fsm.name);
                                }
                            }
                            names.sort();
                            return names;
                        },
                        filteredSrc(env) {
                            if (!env || env == ' ') {
                                return this.openblock.srcs;
                            }
                            let srcs = this.openblock.srcs;
                            if (env.startsWith('env/')) {
                                env = env.substring(4);
                                let f = srcs.filter(src => {
                                    if (src.env.length == 0) {
                                        return true;
                                    }
                                    if (src.env.indexOf(env) >= 0) {
                                        return true;
                                    }
                                    return false;
                                });
                                return f;
                            } else if (env.startsWith('scene/')) {
                                let id = env.substring(6);
                                let scene = SceneManager.getScene(id);
                                if (!scene) {
                                    return [];
                                }
                                let srcList = scene.srcList;
                                let f = srcs.filter(src => srcList.indexOf(src.name) >= 0);
                                return f;
                            } else {
                                throw Error(env);
                            }
                        },
                        async newModule() {
                            let scene = [];
                            let env = [];
                            if (!this.currentScene) {
                            } else if (this.currentScene.startsWith('env/')) {
                                env = [this.currentScene.substring(4)];
                            } else if (this.currentScene.startsWith('scene/')) {
                                let id = this.currentScene.substring(6);
                                let _scene = SceneManager.getScene(id);
                                if (_scene) {
                                    scene = [id];
                                    env = [_scene.env];
                                }
                            }
                            try {
                                let d = await this.newFile(env, scene);
                                if (d) {
                                    this.editSrc(d);
                                }
                            } catch (e) {
                                console.log(e);
                            }
                        },
                        changeEnv(envName) {
                            this.currentScene = envName;
                        },
                        currentSceneName() {
                            if (!this.currentScene) {
                                return this.$t('全部');
                            } else if (this.currentScene === ' ') {
                                return this.$t('通用')
                            }
                            if (this.currentScene.startsWith('env/')) {
                                return this.$t(this.currentScene.substring(4));
                            } else if (this.currentScene.startsWith('scene/')) {
                                let id = this.currentScene.substring(6);
                                let scene = SceneManager.getScene(id);
                                return scene ? scene.name : id;
                            }
                        },
                        clear() {
                            this.chartWindowTitle = null;
                            this.showChart = false;
                            if (this.chart) {
                                this.chart.dispose();
                                this.chart = null;
                            }
                        },
                        openStruct(src, struct, blockId) {
                            if (typeof (src) == 'string') {
                                src = OpenBlock.getSrcByName(src);
                            }
                            if (typeof (struct) == 'string') {
                                struct = OpenBlock.getStructGroupByStructName(src, struct);
                            }
                            OB_IDE.openFile('struct', src, struct, blockId);
                            OB_IDE.closeSider();
                        },
                        openFunction(src, func, blockId) {
                            if (typeof (src) == 'string') {
                                src = OpenBlock.getSrcByName(src);
                            }
                            if (typeof (func) == 'string') {
                                func = OpenBlock.getFuncGroupByFunctionName(src, func);
                            }
                            OB_IDE.openFile('function', src, func, blockId);
                            OB_IDE.closeSider();
                        },
                        openState(src, fsm, state, blockId) {
                            if (typeof (src) == 'string') {
                                src = OpenBlock.getSrcByName(src);
                            }
                            if (typeof (fsm) == 'string') {
                                fsm = OpenBlock.getFsmByName(src, fsm);
                            }
                            if (typeof (state) == 'string') {
                                state = OpenBlock.getStateByName(fsm, state);
                            }
                            OB_IDE.openFile('state', src, fsm, state, blockId);
                            OB_IDE.closeSider();
                        },
                        openActionGroup(src, fsm, ag) {
                            OB_IDE.openFile('actionGroup', src, fsm, ag, null);
                            OB_IDE.closeSider();
                        },
                        removeActionGroup(fsm, idx) {
                            fsm.functions.splice(idx, 1);
                            OpenBlock.saveAllSrc();
                            OpenBlock.BlocklyParser.analyze();
                            OpenBlock.compileAllSrc();
                            this.refresh();
                        },
                        highlightErrBlock: function (errinfo) {
                            if (!errinfo.err.src) {
                                return;
                            }
                            if (errinfo.err.state) {
                                this.openState(errinfo.err.src,
                                    errinfo.err.fsm,
                                    errinfo.err.state, errinfo.err.blockId);
                            } else if (errinfo.err.func) {
                                this.openFunction(errinfo.err.src, errinfo.err.func, errinfo.err.blockId);
                            } else if (errinfo.err.struct) {
                                this.openStruct(errinfo.err.src, errinfo.err.struct, errinfo.err.blockId);
                            }
                        },
                        /**
                         * 
                         * @param {*} fsm 
                         * @param {StateAnalysesResultFSM} analysed 
                         * @returns {{stateNodes:Object[],links:Object[]}}
                         */
                        makeStateSeries(src, fsm, analysed) {
                            /**
                             * 
                             * nodes:
                            {
                                label() {
                                    return "Point A";
                                },
                                tooltip() {
                                    return "tooltip A"
                                },
                                onclick() {
                                    alert("A");
                                },
                                "id": "0",
                                "name": "A",
                                "category": 0
                            }
                            * links:
                                            {
                                                "source": "1",
                                                "target": "0",
                                                label() {
                                                    return "1-0";
                                                },
                                                tooltip() {
                                                    return "TOOLTIP 1-0";
                                                },
                                                onclick() {
                                                    alert("1-0");
                                                }
                                            }
                             */
                            let stateNodes = [];
                            let links = []
                            let root = this.$root;
                            let self = this;
                            Object.values(fsm.states).forEach(s => {
                                s.category = s === fsm.states[0] ? 0 : 1;
                                s.id = s.name;
                                let onclick = () => {
                                    // root.selectState(src, fsm, s);
                                    OB_IDE.openFile('state', src, fsm, s);
                                    OB_IDE.closeSider();
                                };
                                s.onclick = onclick;
                                stateNodes.push(s);
                                if (analysed.states[s.name]) {
                                    let state = analysed.states[s.name];
                                    let outlinks = state.relevantStates;
                                    outlinks.forEach(target => {
                                        let l = {
                                            target,
                                            source: s.name,
                                            onclick,
                                            symbolSize: 15,
                                            lineStyle: {
                                                color: '#ccf'
                                            },
                                        }
                                        links.push(l);
                                        let targetState = analysed.states[target];
                                        let targetState1 = OpenBlock.getStateByName(fsm, targetState.name);
                                        if (targetState.popBack) {
                                            l = {
                                                target: s.name,
                                                source: target,
                                                lineStyle: {
                                                    color: '#cee'
                                                },
                                                onclick() {
                                                    // root.selectState(src, fsm, targetState1);
                                                    OB_IDE.openFile('state', src, fsm, targetState1);
                                                    OB_IDE.closeSider();
                                                },
                                            }
                                            links.push(l);
                                        } else {
                                            // l.symbol = ['none', 'arrow'];
                                        }
                                    });
                                }
                            });
                            return { stateNodes, links };
                        },
                        makeFSMCreateTreeSeries(series) {
                            let compiled = OpenBlock.Compiler.compiled;
                            // let allTree = {};
                            let addedFSM = {};
                            let data = [];
                            let links = [];
                            let that = this;
                            Object.values(compiled).forEach(c => {
                                Object.keys(c.analysed.FSMCreateTree.staticFunctions).forEach(funcFullname => {
                                    let staticFunc = c.analysed.FSMCreateTree.staticFunctions[funcFullname];
                                    staticFunc.points.forEach(point => {
                                        /**
                                         * @type {FunctionTreeDataUtil}
                                         */
                                        let util = OpenBlock.FunctionTreeDataUtil;
                                        let targetFSMFullname = point.targetFSMName;
                                        let func = util.functions[funcFullname];
                                        func.deepCalled.forEach(called => {
                                            let caller = util.functions[called];
                                            if (caller.fsmFullname) {
                                                let link = {
                                                    "source": caller.fsmFullname,
                                                    "target": targetFSMFullname,
                                                    "lineStyle": {
                                                        "type": [5, 10]
                                                    }
                                                };
                                                links.push(link);
                                            }
                                        });
                                    });
                                });
                                Object.keys(c.analysed.FSMCreateTree.fsm).forEach(fsmidx => {
                                    let fsm1 = c.analysed.FSMCreateTree.fsm[fsmidx];
                                    let fullname = c.header.name + '.' + fsmidx;
                                    let node = addedFSM[fullname] || {
                                        name: fullname, id: fullname, label: fullname,
                                        onclick() {
                                            that.showFSMCreateTree(c.header.name, fsmidx)
                                        }
                                    };
                                    if (!addedFSM[fullname]) {
                                        data.push(node);
                                        addedFSM[fullname] = node;
                                    }
                                    Object.keys(fsm1.state).forEach(stateIdx => {
                                        let state = fsm1.state[stateIdx];
                                        state.points.forEach(code => {
                                            let targetFSMFullname = code.targetFSMName;
                                            let targetModule = targetFSMFullname.substring(0, targetFSMFullname.indexOf('.'));
                                            let targetFSM = targetFSMFullname.substring(targetFSMFullname.indexOf('.') + 1);
                                            if (!addedFSM[targetFSMFullname]) {
                                                let t = {
                                                    name: targetFSMFullname,
                                                    id: targetFSMFullname,
                                                    label: targetFSMFullname,
                                                    onclick() {
                                                        that.showFSMCreateTree(targetModule, targetFSM)
                                                    }
                                                };
                                                addedFSM[targetFSMFullname] = t;
                                                data.push(t);
                                            }
                                            let link = {
                                                "source": fullname,
                                                "target": targetFSMFullname,
                                            };
                                            links.push(link);
                                        });
                                    });
                                    Object.keys(fsm1.action).forEach(actionIdx => {
                                        let action = fsm1.action[actionIdx];
                                        action.points.forEach(code => {
                                            let targetFSMFullname = code.targetFSMName;
                                            let targetModule = targetFSMFullname.substring(0, targetFSMFullname.indexOf('.'));
                                            let targetFSM = targetFSMFullname.substring(targetFSMFullname.indexOf('.') + 1);
                                            if (!addedFSM[targetFSMFullname]) {
                                                let t = {
                                                    name: targetFSMFullname,
                                                    id: targetFSMFullname,
                                                    label: targetFSMFullname,
                                                    onclick() {
                                                        that.showFSMCreateTree(targetModule, targetFSM)
                                                    }
                                                };
                                                addedFSM[targetFSMFullname] = t;
                                                data.push(t);
                                            }
                                            let link = {
                                                "source": fullname,
                                                "target": targetFSMFullname,
                                            };
                                            links.push(link);
                                        });
                                    });
                                });
                            });
                            series.links = links;
                            series.data = data;
                            this.fsmCreateSeries = series;
                        },
                        async showFSMCreateTree(file, fsm) {
                            await OpenBlock.saveAllSrc();
                            await OpenBlock.compileAllSrc();
                            let ops;
                            if (this.isScene) {
                                let id = this.currentScene.substring(6);
                                let scene = SceneManager.getScene(id);
                                ops = toRaw(scene);
                            } else {
                                let scenes = SceneManager.scenesWithSrc(file);
                                if (scenes.length > 0) {
                                    ops = toRaw(scenes[0]);
                                }
                            }
                            await OpenBlock.exportExePackage(ops);
                            if (!OpenBlock.Compiler.compiled[file]) {
                                this.$Message.error(OpenBlock.i('编译失败'));
                                return;
                            }
                            if (!this.fsmCreateSeries) {
                                this.$Message.error(OpenBlock.i('需要编译'));
                                return;
                            }
                            let fullname = file + '.' + fsm;
                            this.fsmCreateSeries.data.forEach(node => {
                                if (node.name === fullname) {
                                    node.itemStyle = {
                                        color: '#f66'
                                    }
                                } else {
                                    delete node.itemStyle;
                                }
                            });
                            this.fsmCreateSeries.links.forEach(link => {
                                if (link.source === fullname) {
                                    link.lineStyle = link.lineStyle || {};
                                    link.lineStyle.color = '#cee'
                                    link.lineStyle.width = 4;
                                    link.symbolSize = 15;
                                    link.value = 10;
                                } else if (link.target === fullname) {
                                    link.lineStyle = link.lineStyle || {};
                                    link.lineStyle.color = '#ccf'
                                    link.lineStyle.width = 4;
                                    link.symbolSize = 15;
                                    link.value = 10;
                                } else {
                                    if (link.lineStyle) {
                                        delete link.lineStyle.color;
                                        delete link.lineStyle.width;
                                    }
                                    link.symbolSize = 8;
                                    link.value = 1;
                                }
                            });
                            this.chartWindowTitle = OpenBlock.i('构建图谱');
                            this.showChart = true;
                            nextTick().then(() => {
                                let option = { series: this.fsmCreateSeries };
                                if (!this.chart) {
                                    var chartDom = this.$refs.chart;
                                    // var myChart = echarts.init(chartDom);
                                    var myChart = echarts.init(chartDom, null, { renderer: 'canvas' });

                                    myChart.on('click', function (params) {
                                        if (params.data.onclick && typeof (params.data.onclick) === 'function') {
                                            params.data.onclick();
                                        }
                                    });
                                    this.chart = myChart;
                                }
                                this.chart.setOption(option);
                            });
                        },
                        async showStateTransition(file, fsm) {
                            await OpenBlock.compileAllSrc();
                            if (!OpenBlock.Compiler.compiled[file.name]) {
                                this.$Message.error(OpenBlock.i('编译失败'));
                                return;
                            }
                            let analysed_m = OpenBlock.Compiler.compiled[file.name].analysed.StateTransition;
                            let analysed = analysed_m.fsm[fsm.name];
                            let series = this.makeStateSeries(file, fsm, analysed);
                            this.chartWindowTitle = OpenBlock.i('状态转换概览');
                            this.showChart = true;
                            nextTick().then(() => {
                                var chartDom = this.$refs.chart;
                                var myChart = echarts.init(chartDom, null, { renderer: 'canvas' });
                                var option = {
                                    title: {
                                        text: file.name + "." + fsm.name,
                                        top: 'bottom',
                                        left: 'right'
                                    },
                                    // tooltip: {},
                                    tooltip: {
                                        show: true,
                                        formatter(param) {
                                            if (param.data) {
                                                let t = typeof (param.data.tooltip);
                                                if (t === 'function') {
                                                    return param.data.tooltip();
                                                }
                                                return param.data.tooltip;
                                            }
                                        }
                                    },
                                    series: [
                                        {
                                            name: fsm.name,
                                            type: 'graph',
                                            // initLayout: 'circular',
                                            layout: 'force',
                                            force: {
                                                // initLayout: 'circular',
                                                repulsion: 800
                                            },
                                            edgeSymbol: ['none', 'arrow'],
                                            roam: true,
                                            symbolSize: 30,
                                            edgeSymbolSize: [4, 10],
                                            lineStyle: {
                                                opacity: 0.9,
                                                width: 2,
                                                curveness: 0.2
                                            },
                                            edgeLabel: {
                                                show: false,
                                                formatter(param) {
                                                    if (param.data) {
                                                        let t = typeof (param.data.label);
                                                        if (t === 'function') {
                                                            return param.data.label();
                                                        }
                                                        return param.data.name;
                                                    }
                                                }
                                            },
                                            label: {
                                                show: true,
                                                // position: "right"
                                                formatter(param) {
                                                    if (param.data) {
                                                        let t = typeof (param.data.label);
                                                        if (t === 'function') {
                                                            return param.data.label();
                                                        }
                                                        return param.data.name;
                                                    }
                                                }
                                            },
                                            // 高亮样式。
                                            emphasis: {
                                                focus: 'adjacency',
                                                itemStyle: {
                                                    // 高亮时点的颜色。
                                                    // color: 'blue'
                                                },
                                                label: {
                                                    show: true,
                                                    // 高亮时标签的文字。
                                                    // formatter: 'This is a emphasis label.'
                                                },
                                                lineStyle: {
                                                    // width: 10
                                                },
                                                edgeLabel: {
                                                    show: true,
                                                    // width: 10,
                                                    formatter(param) {
                                                        if (param.data) {
                                                            let t = typeof (param.data.label);
                                                            if (t === 'function') {
                                                                return param.data.label();
                                                            }
                                                            return param.data.label;
                                                        }
                                                    }
                                                },
                                            },
                                            data: series.stateNodes,
                                            links: series.links,
                                            categories: [
                                                {
                                                    name: OpenBlock.i('初始状态')
                                                },
                                                {
                                                    name: OpenBlock.i('状态')
                                                },
                                                {
                                                    name: OpenBlock.i('消息')
                                                },
                                                {
                                                    name: OpenBlock.i('事件')
                                                },
                                                {
                                                    name: OpenBlock.i('函数')
                                                },
                                            ],
                                        }
                                    ]
                                };
                                // 使用刚指定的配置项和数据显示图表。
                                myChart.setOption(option);

                                myChart.on('click', function (params) {
                                    if (params.data.onclick && typeof (params.data.onclick) === 'function') {
                                        params.data.onclick();
                                    }
                                });
                                this.chart = myChart;
                            });
                        },
                        updateEnv() {
                            let envs = OpenBlock.Env.instances;
                            let info = [];
                            envs.forEach((e) => {
                                let srcs = this.filteredSrc('env/' + e.name);
                                info.push({ name: e.name, srcCnt: srcs.length });
                            });
                            this.env = info;
                            // 这里为了强制渲染
                            let e = this.currentScene;
                            this.currentScene = 's';
                            this.currentScene = e;
                        }
                    },
                    template: template,
                    mounted() {
                        Logic.instance = this;
                        let that = this;
                        OpenBlock.Env.onChange(() => {
                            that.updateEnv();
                        });
                        OpenBlock.VFS.partition.src.on('changed', () => {
                            that.updateEnv();
                        });
                        that.updateEnv();
                        OpenBlock.Linker.onFinished(() => {
                            let series = {
                                name: '',
                                type: 'graph',
                                // initLayout: 'circular',
                                layout: 'force',// 'circular',//'force',
                                force: {
                                    // initLayout: 'circular',
                                    autoCurveness: true,
                                    repulsion: 500,
                                    // gravity: 1,
                                    edgeLength: [10, 100],
                                },
                                draggable: true,
                                edgeSymbol: ['none', 'arrow'],
                                roam: true,
                                symbolSize: 30,
                                edgeSymbolSize: [4, 10],
                                lineStyle: {
                                    opacity: 1,
                                    width: 2,
                                    curveness: 0.1,
                                    color: '#eee',
                                },
                                edgeLabel: {
                                    show: false,
                                    formatter(param) {
                                        if (param.data) {
                                            let t = typeof (param.data.label);
                                            if (t === 'function') {
                                                return param.data.label();
                                            }
                                            return param.data.name;
                                        }
                                    }
                                },
                                label: {
                                    show: true,
                                    // position: "right"
                                    formatter(param) {
                                        if (param.data) {
                                            let t = typeof (param.data.label);
                                            if (t === 'function') {
                                                return param.data.label();
                                            }
                                            return param.data.name;
                                        }
                                    }
                                },
                                // 高亮样式。
                                emphasis: {
                                    focus: 'adjacency',
                                    itemStyle: {
                                        // 高亮时点的颜色。
                                        // color: 'blue'
                                    },
                                    label: {
                                        show: true,
                                        // 高亮时标签的文字。
                                        // formatter: 'This is a emphasis label.'
                                    },
                                    lineStyle: {
                                        // width: 10
                                    },
                                    edgeLabel: {
                                        show: true,
                                        // width: 10,
                                        formatter(param) {
                                            if (param.data) {
                                                let t = typeof (param.data.label);
                                                if (t === 'function') {
                                                    return param.data.label();
                                                }
                                                return param.data.label;
                                            }
                                        }
                                    },
                                },
                            };
                            that.makeFSMCreateTreeSeries(series);
                        });
                    }
                };
                resolve(obLogicSider);
            });

        });
    })
})
export default Logic;