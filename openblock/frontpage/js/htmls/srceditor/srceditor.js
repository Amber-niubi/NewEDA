
import SceneIcon from "../SceneManager/SceneIcon.mjs";
import { defineAsyncComponent, markRaw } from 'vue';
OpenBlock.onInited(() => {
    // 后台自动编译打包
    let timeout = -1;
    /**
     * 特别关注块类型。如果此类型的块发生变化，要尽快编译。
     */
    let special_focus_block_type = ['typed_procedures', "struct_field"];
    let varEditor = defineAsyncComponent(() => {
        return new Promise((resolve, reject) => {
            axios({
                url: 'js/htmls/srceditor/srceditor.html',
                responseType: 'text',
                async: false
            }).then(({ data }) => {
                resolve({
                    template: data,
                    data() {
                        return {}
                    },
                    props: ['data', 'modal'],
                    methods: {
                        avalibleVarTypes(value) {
                            function check(v1, v2) {
                                if (!v1) {
                                    return false;
                                }
                                v1 = v1.toLowerCase();
                                return v1.indexOf(v2) > -1;
                            }
                            value = value.toLowerCase();
                            let structTypes = OpenBlock.getAvailableTypes(this.data.createVarInfo.src);
                            let newTypes = structTypes.filter(t => check(t[0], value) || check(t[1], value)).map(t => t[0]);
                            this.data.createVarInfo.baseData = newTypes;
                        },
                        apply() {
                            let i = this.data.createVarInfo;
                            if (!i.name) {
                                this.$Message.error(OpenBlock.i('未设置名称'));
                                return;
                            }
                            let typeName = i.type;
                            let allType = OpenBlock.getAvailableTypes(i.src);
                            let type = allType.find(t => t[0] === typeName);
                            if (type) {
                                i.type = type[1];
                            } else {
                                this.$Message.error(OpenBlock.i('未设置类型'));
                                return;
                            }
                            this.data.resolve(this.data.createVarInfo);
                            this.modal.close();
                        }
                    },
                    mounted() {
                        this.avalibleVarTypes('');
                    }
                });
            });
        })
    });
    varEditor = markRaw(varEditor);
    OpenBlock.config.uiCallbacks.addFsmVariable = function (src, fsm, workspace) {
        let p = new Promise(async (resolve, reject) => {
            let win = await OB_IDE.openModal({
                title: OpenBlock.i('FSM') + OpenBlock.i('变量'),
                component: varEditor,
                componentOptions: {
                    resolve,
                    createVarInfo:
                        { src, name: "", type: '', wrap: "", baseData: [], export: true, workspace }
                }
            });
        });
        return p;
    };
    OpenBlock.config.uiCallbacks.addStateVariable = function (src, fsm, workspace) {
        let p = new Promise(async (resolve, reject) => {
            let win = await OB_IDE.openModal({
                title: OpenBlock.i('状态变量'),
                component: varEditor,
                componentOptions: {
                    resolve,
                    createVarInfo:
                        { src, name: "", type: '', wrap: "", baseData: [], export: true, workspace }
                }
            });
        });
        return p;
    };
    function openSrc(key, target, labelBuilder, blocklyBuilder, blockId) {
        let w;
        OB_IDE.openTab({
            key, target,
            labelBuilder,
            builderFunc(dom, tab) {
                w = blocklyBuilder(dom, tab);
                let ws = w.context.workspace;
                let autosave = function (e) {
                    if (!(e instanceof Blockly.Events.FinishedLoading)) {
                        return;
                    }
                    ws.removeChangeListener(autosave);
                    async function save(ws) {

                        OB_IDE.tabs.forEach(async (tab) => {
                            let t = tab.content;
                            if (t && t.saveCode && t.context) {
                                await new Promise((resolve, rej) => {
                                    setTimeout(() => {
                                        console.log('save');
                                        t.saveCode();
                                        resolve();
                                    }, 0);
                                });
                            }
                        });
                        timeout = -1;
                        // OB_IDE.compiling = true;
                        OpenBlock.compileAllSrc(() => {
                            // OB_IDE.compiling = false;
                            OB_IDE.$forceUpdate();
                        });
                    }
                    ws.addChangeListener(function (e) {
                        // if (e.group) {
                        //     return;
                        // }
                        if (timeout > 0) {
                            clearTimeout(timeout);
                            timeout = setTimeout(save, 500);
                        }
                        if (OpenBlock.Utils.canBlockEventSkipSave(e)) {
                            return;
                        }
                        if (e instanceof Blockly.Events.FinishedLoading) {
                            return true;
                        }
                        console.log("autosave", e);
                        OpenBlock.Compiler.stop();
                        OpenBlock.Linker.stop();
                        let time = 10000;
                        if (e.recordUndo) {
                            time = 5000;
                        }
                        if (e.blockId) {
                            let ws = Blockly.Workspace.getById(e.workspaceId);
                            if (ws) {
                                let blk = ws.getBlockById(e.blockId);
                                while (blk) {
                                    if (special_focus_block_type.indexOf(blk.type) >= 0) {
                                        time = 100;
                                        break;
                                    }
                                    blk = blk.getParent();
                                }
                            }
                        }
                        timeout = setTimeout(save, time, Blockly.Workspace.getById(e.workspaceId));

                    });
                };
                ws.addChangeListener(autosave);
                return w;
            },
            onClose(tab) {
                tab.content.dispose();
            }
        });
        if (blockId) {
            setTimeout(() => {
                let tab = OB_IDE.getTab(key);
                if (tab) {
                    let workspace = tab.content.context.workspace;
                    let blk = workspace.getBlockById(blockId);
                    if (blk) {
                        blk.select();
                        OpenBlock.Utils.centerOnSingleBlock(workspace, blk.id);
                    }
                }
            }, 5);
        }
    }
    OB_IDE.registerOpenWith(['state', 'function', 'struct', 'actionGroup'], 'defaultStateSrcEditor', (fileType, src, b, c, d) => {
        if (fileType == 'state') {
            let fsm = b;
            let state = c;
            let blockId = d;
            let key = 'src://' + src.name + '/' + fsm.name + '/' + state.name + '.state';
            let w;
            openSrc(
                key,
                state,
                h => {
                    return h('div', { class: "ns bold", title: src.name + '/' + fsm.name + '/' + state.name }, [
                        h(SceneIcon, { name: src.name, nameOf: 'moduleName' }),
                        h('i', { class: "ivu-icon ivu-icon-md-clock" }),
                        state.name + ":" + fsm.name,
                        h('i', {
                            class: "ivu-icon ivu-icon-ios-close", onClick: function () {
                                if (w && w.saveCode) {
                                    w.saveCode();
                                    // w.dispose();
                                }
                                OB_IDE.closeTab(key);
                            }
                        }
                        )]);
                },
                (dom, tab) => {
                    w = OpenBlock.buildStateBlockly(src, fsm, state, dom);
                    return w;
                },
                blockId);
        } else if (fileType == 'function') {
            let func = b;
            let blockId = c;
            let key = 'src://' + src.name + '/' + func.name + '.func';
            let w;
            openSrc(
                key,
                func,
                h => {
                    return h('div', { class: "ns bold", title: src.name + '/' + func.name }, [
                        h(SceneIcon, { name: src.name, nameOf: 'moduleName' }),
                        h('i', { class: "ivu-icon ivu-icon-ios-fastforward" }),
                        func.name,
                        h('i', {
                            class: "ivu-icon ivu-icon-ios-close", onClick: function () {
                                if (w && w.saveCode) {
                                    w.saveCode();
                                    // w.dispose();
                                }
                                OB_IDE.closeTab(key);
                            }
                        }
                        )]);
                },
                (dom, tab) => {
                    w = OpenBlock.buildFunctionBlockly(src, func, dom);
                    return w;
                },
                blockId);
        } else if (fileType == 'struct') {
            let struct = b;
            let blockId = c;
            let key = 'src://' + src.name + '/' + struct.name + '.struct';
            let w;
            openSrc(
                key,
                struct,
                h => {
                    return h('div', { class: "ns bold", title: src.name + '/' + struct.name }, [
                        h(SceneIcon, { name: src.name, nameOf: 'moduleName' }),
                        h('i', { class: "ivu-icon ivu-icon-ios-fastforward" }),
                        struct.name,
                        h('i', {
                            class: "ivu-icon ivu-icon-ios-close", onClick: function () {
                                if (w && w.saveCode) {
                                    w.saveCode();
                                    // w.dispose();
                                }
                                OB_IDE.closeTab(key);
                            }
                        }
                        )]);
                },
                (dom, tab) => {
                    w = OpenBlock.buildStructBlockly(src, struct, dom);
                    return w;
                },
                blockId);
        } else if (fileType == 'actionGroup') {
            let fsm = b;
            let actionGroup = c;
            let blockId = d;
            let key = 'src://' + src.name + '/' + fsm.name + '/' + actionGroup.name + '.action';
            let w;
            openSrc(
                key,
                actionGroup,
                h => {
                    return h('div', { class: "ns bold", title: fsm.name + '/' + actionGroup.name }, [
                        h(SceneIcon, { name: src.name, nameOf: 'moduleName' }),
                        h('i', { class: "ivu-icon ivu-icon-md-bicycle" }),
                        actionGroup.name,
                        h('i', {
                            class: "ivu-icon ivu-icon-ios-close", onClick: function () {
                                if (w && w.saveCode) {
                                    w.saveCode();
                                    // w.dispose();
                                }
                                OB_IDE.closeTab(key);
                            }
                        }
                        )]);
                },
                (dom, tab) => {
                    w = OpenBlock.buildActionGroupBlockly(src, fsm, actionGroup, dom);
                    return w;
                },
                blockId);
        }
    });
});