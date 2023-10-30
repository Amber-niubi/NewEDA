/**
 * @license
 * Copyright 2021 Du Tian Wei
 * SPDX-License-Identifier: Apache-2.0
 */

let OpenBlock = {
    I18N: {},
    wsBuildCbs: [],
    connectors: [],
    defaultConfirm(msg, callback) {
        if (confirm(msg)) {
            callback(true);
        } else {
            callback(false);
        }
    },
    i(msg) {
        if (msg == null) {
            return '';
        }
        if (OpenBlock.I18N) {
            let t = OpenBlock.I18N[msg];
            if (t) {
                return t;
            }
        }
        if (!window.Blockly) {
            console.log('尚未初始化Blockly');
            return msg;
        }
        if (!Blockly.Msg) {
            console.log('尚未初始化Blockly.Msg');
            return msg;
        }
        let bm = Blockly.Msg[msg];
        if (bm) {
            return bm;
        } else {
            return msg;
        }
    },
    srcs: [
        '../3rd/sprintf.min.js',
        '../3rd/blockly-plugins/field-grid-dropdown.js',
        '../3rd/blockly-plugins/zoom-to-fit.js',
        '../3rd/blockly-plugins/modal.js',
        '../3rd/easysax.js',
        '../3rd/axios.min.js',
        '../3rd/sheetjs/jszip.js',
        '../3rd/sheetjs/xlsx.full.min.js',
        'utils.js',
        'dag.js',
        'vfs/vfs.js',
        'env.js',
        'ubdropdown.js',
        'typed_procedures.mjs',
        'typetree.js',
        'UBBCblocks.js',
        'struct.js',
        'compiler/WorkerContext.js',
        'compiler/AST/ModuleAST.js',
        'compiler/compiler.js',
        'compiler/parsers/blocklyfsm.js',
        'compiler/parsers/blocklyparser.js',
        'compiler/parsers/blocks.js',
        'compiler/linker.js',
        'compiler/datastructure.js',
        'compiler/buildinFunctions.js',
        'asyncparser.js',
        'dataImporter.js',
        'nativeBlock.js',
        'NativeTypeChecker.js',
        'compiler/analyses/stateData.js',
        'compiler/analyses/fsmtreeData.js',
        'compiler/analyses/functionTreeData.js',
        'compiler/analyses/functionTreeDataUtil.js',
        'toolboxSearch.js',
        'collect.js',
        // 'project.js',
        'version/versions.js',
        'version/0to1.js',
        'version/1to2.mjs',
        'debugger/connector.js',
    ]
};
window.OpenBlock = OpenBlock;
(function () {
    let scripts = document.getElementsByTagName('script');
    for (let script of scripts) {
        if (script.src.endsWith('OpenBlock.js')) {
            let src = script.src;
            OpenBlock.bootPath = src.substring(0, src.length - 12);
            let i = OpenBlock.bootPath.indexOf('//');
            if (i >= 0 && i <= 6) {
                i = OpenBlock.bootPath.indexOf('/', i + 3);
                let p = OpenBlock.bootPath.substring(i);
                OpenBlock.safePath = p;
            } else {
                OpenBlock.safePath = OpenBlock.bootPath;
            }
            break;
        }
    }
    OpenBlock.srcs.forEach((src, index) => {
        // axios({
        //     url: src,
        //     dataType: 'text',
        //     async: true,
        //     success(data, status, xhr) {
        //     }
        // });
        // <link rel="preload" href="./nextpage.js" as="script"></link>
        src = OpenBlock.bootPath + src;
        OpenBlock.srcs[index] = src;
        let link = document.createElement('link');
        link.rel = "preload";
        link.as = 'script';
        link.href = src;
        document.head.appendChild(link);
    });
})();
OpenBlock.InitWorkspace = (ws) => {
    OpenBlock.wsBuildCbs.forEach((cb) => {
        cb(ws);
    });
};
OpenBlock.saveAllSrc = async function (cb) {
    let p = new Promise((resolve, reject) => {
        VFS.partition.src.allFiles(files => {
            Object.keys(files).forEach(name => {
                let file = files[name];
                VFS.partition.src.put(file.name, (file.content));
            });
            if (cb) {
                cb();
            }
            resolve();
        });
    });
    return p;
}
OpenBlock.init = (conf) => {
    if (conf.uiCallbacks) {
        conf.uiCallbacks = Object.assign({
            confirm: OpenBlock.defaultConfirm
        }, conf.uiCallbacks);
    }
    conf = Object.assign({
        extI18NPath: OpenBlock.bootPath + 'i18n/',
        logicToolbox: null,
        lang: null,
    }, conf);
    if (!conf.toolbox) {
        throw new Error('toolbox required');
    }
    if (typeof (conf.toolbox.state) !== 'string') {
        throw new Error('state toolbox must be string');
    }
    if (typeof (conf.toolbox.function) !== 'string') {
        throw new Error('function toolbox must be string');
    }
    OpenBlock.config = conf;
    OpenBlock.language = (OpenBlock.config.lang || new URLSearchParams(location.search).get('lang') || navigator.language || navigator.browserLanguage);
    let srcs = OpenBlock.srcs;

    function addI18n(path) {
        // let s = document.head.appendChild(document.createElement('script'))
        // s.src = './js/i18n/' + path + '.js'
        if (srcs.indexOf(path) >= 0) {
            return;
        }
        if (OpenBlock.config.extI18NPath) {
            srcs.unshift(OpenBlock.config.extI18NPath + path + '.js');
        }
        srcs.unshift(OpenBlock.bootPath + 'i18n/' + path + '.js');
        srcs.unshift(OpenBlock.bootPath + '../3rd/blockly/msg/js/' + path.toLowerCase() + '.js');
    }
    if (OpenBlock.language !== 'zh-hans' && OpenBlock.language !== 'zh-cn') {
        let subIndex = OpenBlock.language.indexOf('-');
        if (subIndex > 0) {
            let fallbackLang = OpenBlock.language.substring(0, subIndex);
            addI18n(fallbackLang);
        }
        addI18n(OpenBlock.language);
    }
    addI18n('zh-hans');
    // blockly 应该在最先，比i18n先
    srcs.unshift(OpenBlock.bootPath + '../3rd/blockly@9.2.1/blockly.min.js');
    // srcs.unshift("https://unpkg.com/blockly/blockly.min.js");
    function loadJS(srcs, cb) {
        function loadScript() {
            if (srcs.length === 0) {
                if (cb) {
                    cb();
                    return;
                }
            }
            let src = srcs.shift();
            if (src) {
                if (src.endsWith('.mjs')) {
                    import(src).then(module => {
                        loadScript();
                    }).catch(e => {
                        if (e.currentTarget.src.indexOf('/msg/') < 0
                            && e.currentTarget.src.indexOf('/i18n/') < 0) {
                            console.error(e);
                        }
                        loadScript();
                    });
                } else {
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
                }
                //loadScript();
            }
        }
        loadScript();
    }
    loadJS(srcs, OpenBlock._onInited);
};

OpenBlock.initedCbs = [];

OpenBlock.onInited = function (f) {
    if (OpenBlock.inited) {
        setTimeout(() => {
            f();
        }, 0);
    } else {
        OpenBlock.initedCbs.push(f);
    }
};
OpenBlock.onInitedPromise = function () {
    return new Promise((r) => {
        OpenBlock.onInited(r);
    });
};
OpenBlock.configBlockly = function () {
    // 删除原来的 禁用块 菜单项
    Blockly.ContextMenuRegistry.registry.unregister('blockDisable');
    // 注册新的
    /** @type {!ContextMenuRegistry.RegistryItem} */
    const disableOption = {
        displayText: function (/** @type {!ContextMenuRegistry.Scope} */
            scope) {
            return (scope.block.isEnabled()) ? OpenBlock.i('DISABLE_BLOCK') :
                OpenBlock.i('ENABLE_BLOCK');
        },
        preconditionFn: function (/** @type {!ContextMenuRegistry.Scope} */
            scope) {
            const block = scope.block;
            if (!block.isInFlyout && block.workspace.options.disable &&
                block.isEditable() && !block.outputConnection) {
                if (block.getInheritedDisabled()) {
                    return 'disabled';
                }
                return 'enabled';
            }
            return 'hidden';
        },
        callback: function (/** @type {!ContextMenuRegistry.Scope} */
            scope) {
            const block = scope.block;
            const group = Blockly.Events.getGroup();
            if (!group) {
                Blockly.Events.setGroup(true);
            }
            block.setEnabled(!block.isEnabled());
            if (!group) {
                Blockly.Events.setGroup(false);
            }
        },
        scopeType: Blockly.ContextMenuRegistry.ScopeType.BLOCK,
        id: 'blockDisable',
        weight: 5,
    };
    Blockly.ContextMenuRegistry.registry.register(disableOption);


    Blockly.ContextMenuRegistry.registry.register({
        id: "copyXml-workspace",
        scopeType: Blockly.ContextMenuRegistry.ScopeType.WORKSPACE,
        displayText: OpenBlock.i('复制全部XML'),
        preconditionFn() {
            return 'enabled';
        },
        weight: 100,
        callback(e) {
            let dom = Blockly.Xml.workspaceToDom(e.workspace, true);
            let txt = Blockly.Xml.domToText(dom);
            console.log(txt);
            navigator.permissions.query({ name: 'clipboard-write' }).then(function (result) {
                if (result.state == 'granted' || result.state == 'prompt') {
                    navigator.clipboard.writeText(txt);
                }
                // Don't do anything if the permission was denied.
            });
        }
    });
    Blockly.ContextMenuRegistry.registry.register({
        id: "copyXml-blocks",
        scopeType: Blockly.ContextMenuRegistry.ScopeType.BLOCK,
        displayText: OpenBlock.i('复制XML'),
        preconditionFn() {
            return 'enabled';
        },
        weight: 100,
        callback(e) {
            let dom = Blockly.Xml.blockToDomWithXY(e.block, true);
            let txt = Blockly.Xml.domToText(dom);
            console.log(txt);
            navigator.permissions.query({ name: 'clipboard-write' }).then(function (result) {
                if (result.state == 'granted' || result.state == 'prompt') {
                    navigator.clipboard.writeText(txt);
                }
                // Don't do anything if the permission was denied.
            });
        }
    });

    Blockly.ContextMenuRegistry.registry.register({
        id: "copyXml-paste",
        scopeType: Blockly.ContextMenuRegistry.ScopeType.WORKSPACE,
        displayText: OpenBlock.i('粘贴XML'),
        preconditionFn() {
            return 'enabled';
        },
        weight: 100,
        callback(e) {
            navigator.permissions.query({ name: 'clipboard-read' }).then(function (result) {
                if (result.state == 'granted' || result.state == 'prompt') {
                    const existingGroup = Blockly.Events.getGroup();
                    if (!existingGroup) {
                        Blockly.Events.setGroup(true);
                    }
                    navigator.clipboard.readText().then(t => {
                        Blockly.Events.setGroup(true);
                        function pasteBlocks(dom) {
                            try {
                                var testWorkspace = new Blockly.Workspace();
                                testWorkspace.targetWorkspace = e.workspace;
                                Blockly.Xml.domToBlock(dom, testWorkspace);
                                testWorkspace.dispose();
                                e.workspace.paste(dom);
                            } catch (e) {
                                console.warn(e);
                            }
                        }
                        let dom = Blockly.Xml.textToDom(t);
                        if (dom.tagName === 'xml') {
                            for (let i = 0; i < dom.children.length; i++) {
                                let node = dom.children[i];
                                if (node.tagName === 'block' || node.tagName === 'shoadow') {
                                    pasteBlocks(node);
                                }
                            }
                        } else if (dom.tagName === 'block' || dom.tagName === 'shoadow') {
                            pasteBlocks(dom);
                        }
                    }).catch(e => {
                        console.error(e);
                    }).finally(() => {
                        Blockly.Events.setGroup(existingGroup);
                    });
                }
                // Don't do anything if the permission was denied.
            });
        }
    });
    /**
    * Clean up the workspace by ordering all the blocks in a column.
    */
    let oldMethod = Blockly.WorkspaceSvg.prototype.cleanUp;
    Blockly.WorkspaceSvg.prototype.cleanUp = function () {
        oldMethod.call(this);
        this.setResizesEnabled(false);
        Blockly.Events.setGroup(true);
        var topBlocks = this.getTopBlocks(true);
        var cursorX = 0;
        for (var i = 0, block; (block = topBlocks[i]); i++) {
            if (!block.isMovable()) {
                continue;
            }
            var xy = block.getRelativeToSurfaceXY();
            block.moveBy(cursorX - xy.x, - xy.y);
            block.snapToGrid();
            cursorX = block.getRelativeToSurfaceXY().x +
                block.getHeightWidth().width +
                this.renderer.constants_.MIN_BLOCK_WIDTH + 150;
        }
        Blockly.Events.setGroup(false);
        this.setResizesEnabled(true);
    };
};
OpenBlock._onInited = function () {
    // config blockly
    OpenBlock.configBlockly();
    //
    OpenBlock.inited = true;
    function next() {
        /**
         * @type Array<Function>
         */
        let arr = OpenBlock.initedCbs;
        if (arr.length == 0) {
            return;
        }
        let cb = arr.shift();
        let p = cb();
        if (p instanceof Promise) {
            p.then(next);
        } else {
            next();
        }
    }
    next();
};



/**
 * opt:
 * {
 * fsms:[] optional,
 * structs:[] optional,
 * }
 */
OpenBlock.newSrc = (opt, callback) => {
    if (typeof (opt.env) === 'string') {
        opt.env = [opt.env];
    }
    opt = Object.assign(OpenBlock.DataStructure.createModuleTemplate(), opt);

    /**
     * @type {Array}
     */
    let arr = OpenBlock.BlocklyParser.loadedFiles.srcs.concat(OpenBlock.BlocklyParser.loadedFiles.libs);
    if (!opt.name) {
        if (arr.find(i => {
            return i.name === OpenBlock.I18N.START_SRC_NAME;
        })) {
            opt.name = OpenBlock.Utils.genName(OpenBlock.I18N.NEW_SRC_NAME, arr);
        } else {
            opt.name = OpenBlock.Utils.genName(OpenBlock.I18N.START_SRC_NAME, arr);
        }
    }
    if (!OpenBlock.Utils.isIdentifier(opt.name)) {
        callback();
        return;
    }
    let filename = opt.name + '.xs';
    VFS.partition.src.exist(filename, (exist) => {
        if (exist) {
            callback();
        } else {
            OpenBlock.BlocklyParser.analyze();
            VFS.partition.src.put(filename, (opt));
            callback(opt);
        }
    });
};

OpenBlock.addDepends = (src, depends) => {
    if (src.depends.indexOf(depends) === -1) {
        src.depends.push(depends);
    }
    OpenBlock.BlocklyParser.updateDepends();
    OpenBlock.saveAllSrc();
    OpenBlock.compileAllSrc();
};
OpenBlock.removeDepends = (src, depends) => {
    let i = src.depends.indexOf(depends);
    if (i > -1) {
        src.depends.splice(i, 1);
    }
    OpenBlock.BlocklyParser.updateDepends();
    OpenBlock.saveAllSrc();
    OpenBlock.compileAllSrc();
};
OpenBlock.hasFSM = (src, name) => {
    return OpenBlock.Utils.hasName(src.fsms, name);
};
OpenBlock.hasState = (fsm, name) => {
    return OpenBlock.Utils.hasName(fsm.states, name);
};
OpenBlock.hasFunction = (src, name) => {
    return OpenBlock.Utils.hasName(src.functions, name);
};
/**
 * opt:
 * {
 * name:string optional,
 * code:string optional,
 * }
 */


OpenBlock.addFSM = (src, opt) => {
    opt = Object.assign(OpenBlock.DataStructure.createFSMTemplate(), opt);
    if (!opt.name) {
        if (src.name === OpenBlock.I18N.START_SRC_NAME && !src.fsms.find(i => i.name === OpenBlock.I18N.START_FSM_NAME)) {
            opt.name = OpenBlock.Utils.genName(OpenBlock.I18N.START_FSM_NAME, src.fsms);
        } else {
            opt.name = OpenBlock.Utils.genName(OpenBlock.I18N.NEW_FSM_TYPE_NAME, src.fsms);
        }
    }
    if (src.fsms.find(f => f.name == opt.name)) {
        return null;
    }
    src.fsms.push(opt);
    OpenBlock.addState(opt);
    return opt;
};
OpenBlock.addState = (fsm, opt) => {
    opt = Object.assign(OpenBlock.DataStructure.createStateTemplate(), opt);
    if (!opt.name) {
        opt.name = OpenBlock.Utils.genName(OpenBlock.I18N.NEW_STATE_NAME, fsm.states);
    }
    fsm.states.push(opt);
    OpenBlock.BlocklyParser.analyze();
    OpenBlock.saveAllSrc();
    return opt;
};
OpenBlock.removeFSMState = (fsm, v) => {
    for (let i = 0; i < fsm.states.length; i++) {
        if (fsm.states[i] === v) {
            if (fsm.startState === i) {
                fsm.startState = 0;
            }
            fsm.states.splice(i, 1);
        }
    }
    if (fsm.states.length == 0) {
        OpenBlock.addState(fsm, {});
    }
    OpenBlock.saveAllSrc();
    OpenBlock.compileAllSrc();
};
OpenBlock.removeFSMVariable = (fsm, v) => {
    for (let i = 0; i < fsm.variables.length; i++) {
        if (fsm.variables[i] === v) {
            fsm.variables.splice(i, 1);
        }
    }
    OpenBlock.saveAllSrc();
    OpenBlock.BlocklyParser.analyze();
    OpenBlock.compileAllSrc();
};
// OpenBlock.removeFSMVariableBySN = (fsm, sn) => {
//     for (let i = 0; i < fsm.variables.length; i++) {
//         if (fsm.variables[i].sn === sn) {
//             OpenBlock.config.uiCallbacks.confirm('删除 ' + fsm.variables[i].name, (r) => {
//                 if (r) {
//                     fsm.variables.splice(i, 1);
//                     OpenBlock.compileAllSrc();
//                 }
//             });
//         }
//     }
// };
OpenBlock.removeFSMVariableByName = (fsm, name, workspace) => {
    for (let i = 0; i < fsm.variables.length; i++) {
        if (fsm.variables[i].name === name) {
            OpenBlock.config.uiCallbacks.confirm('删除 ' + fsm.variables[i].name, (r) => {
                if (r) {
                    fsm.variables.splice(i, 1);
                    if (workspace) {
                        workspace.getToolbox().clearSelection();
                    }
                    OpenBlock.compileAllSrc();
                }
            });
        }
    }
    OpenBlock.saveAllSrc();
    OpenBlock.compileAllSrc();
};
OpenBlock.removeStateVariableByName = (state, name, workspace) => {
    for (let i = 0; i < state.variables.length; i++) {
        if (state.variables[i].name === name) {
            OpenBlock.config.uiCallbacks.confirm('删除 ' + state.variables[i].name, (r) => {
                if (r) {
                    state.variables.splice(i, 1);
                    if (workspace) {
                        workspace.getToolbox().clearSelection();
                    }
                    OpenBlock.compileAllSrc();
                }
            });
        }
    }
    OpenBlock.saveAllSrc();
    OpenBlock.compileAllSrc();
}
/**
 * 
 * @param {fsm} fsm 
 * @param {object} info { name[string], type[string], wrap[list/map/null], export[bool]}
 */
OpenBlock.addFSMVariable = (fsm, info) => {
    let name;
    if (info.name) {
        name = info.name.trim();
        for (let i in fsm.variables) {
            let v = fsm.variables[i];
            if (v.name === name) {
                throw new Error("NAME_DUPLICATED");
            }
        }
    } else {
        let namebase = OpenBlock.i('属性');
        let tried = 0;
        let found = false;
        do {
            found = false;
            name = tried == 0 ? namebase : namebase + '_' + tried;
            for (let i in fsm.variables) {
                let v = fsm.variables[i];
                if (v.name === name) {
                    found = true;
                    break;
                }
            }
            tried++;
        }
        while (found);
    }
    let type = info.type;
    if (info.wrap) {
        type = info.wrap + '<' + type + '>';
    }
    let vinfo = { name, type: type, export: !!info.export };
    fsm.variables.push(vinfo);
    OpenBlock.BlocklyParser.analyze();
    OpenBlock.saveAllSrc();
    if (info.workspace) {
        let w = info.workspace;
        delete info.workspace;
        w.getToolbox().clearSelection();
    }
};
OpenBlock.addStateVariable = (state, info) => {
    let name = info.name.trim();
    for (let i in state.variables) {
        let v = state.variables[i];
        if (v.name === name) {
            throw new Error("NAME_DUPLICATED");
        }
    }
    let type = info.type;
    if (info.wrap) {
        type = info.wrap + '<' + type + '>';
    }
    let vinfo = { name, type: type, export: !!info.export };
    state.variables.push(vinfo);
    OpenBlock.BlocklyParser.analyze();
    OpenBlock.saveAllSrc();
    if (info.workspace) {
        let w = info.workspace;
        delete info.workspace;
        w.getToolbox().clearSelection();
    }
};

OpenBlock.addFunction = (src, opt) => {
    opt = Object.assign(OpenBlock.DataStructure.createFunctionTemplate(), opt);
    if (!opt.name) {
        opt.name = OpenBlock.Utils.genName(OpenBlock.I18N.NEW_FUNCTION_NAME, src.functions);
    }
    src.functions.push(opt);
    OpenBlock.BlocklyParser.analyze();
    OpenBlock.saveAllSrc();
    if (opt.workspace) {
        let w = opt.workspace;
        delete opt.workspace;
        w.getToolbox().clearSelection();
    }
    return opt;
};
OpenBlock.addFSMActionGroup = (fsm, opt) => {
    if (!fsm.functions) {
        fsm.functions = [];
    }
    opt = Object.assign(OpenBlock.DataStructure.createActionGroupTemplate(), opt ? opt : {});
    if (!opt.name) {
        opt.name = OpenBlock.Utils.genName(OpenBlock.I18N.NEW_ACTION_GROUP_NAME, fsm.functions);
    }
    fsm.functions.push(opt);
    OpenBlock.BlocklyParser.analyze();
    OpenBlock.saveAllSrc();
    if (opt.workspace) {
        let w = opt.workspace;
        delete opt.workspace;
        w.getToolbox().clearSelection();
    }
    return opt;
};
OpenBlock.removeFunction = (s, f) => {
    const index = s.functions.indexOf(f);
    if (index > -1) {
        s.functions.splice(index, 1);
    }
    OpenBlock.saveAllSrc();
    OpenBlock.compileAllSrc();
};
OpenBlock.removeFSMByName = (src, fsmName) => {
    for (let i = 0; i < src.fsms.length; i++) {
        if (src.fsms[i].name === fsmName) {
            src.fsms.splice(i, 1);
        }
    }
};
OpenBlock.removeFSMByName2 = (srcName, fsmName) => {
    let src = OpenBlock.BlocklyParser.loadedFiles.srcs.find(s => s.name === srcName);
    if (src) {
        for (let i = 0; i < src.fsms.length; i++) {
            if (src.fsms[i].name === fsmName) {
                src.fsms.splice(i, 1);
            }
        }
    }
};
OpenBlock.removeFSM = (src, fsm) => {
    for (let i = 0; i < src.fsms.length; i++) {
        if (src.fsms[i] === fsm) {
            src.fsms.splice(i, 1);
        }
    }
};
OpenBlock.getSrcByName = (name) => {
    for (let src of OpenBlock.BlocklyParser.loadedFiles.srcs) {
        if (src.name === name) {
            return src;
        }
    }
    return null;
};

OpenBlock.getLibByName = (name) => {
    for (let src of OpenBlock.BlocklyParser.loadedFiles.libs) {
        if (src.name === name) {
            return src;
        }
    }
    return null;
};

OpenBlock.getFsmByName = (src, name) => {
    if (!src) {
        return null;
    }
    let pointIdx = name.lastIndexOf('.');
    if (pointIdx != -1) {
        name = name.substring(pointIdx + 1);
    }
    for (let fsm of src.fsms) {
        if (fsm.name === name) {
            return fsm;
        }
    }
    return null;
};

OpenBlock.getStateByName = (fsm, name) => {
    if (!fsm) {
        return null;
    }
    for (let state of fsm.states) {
        if (state.name === name) {
            return state;
        }
    }
    return null;
};

OpenBlock.getFuncGroupByName = (src, name) => {
    if (!src) {
        return null;
    }
    for (let func of src.functions) {
        if (func.name === name) {
            return func;
        }
    }
    return null;
};

OpenBlock.getFuncGroupByFunctionName = (src, name) => {
    if (!src) {
        return null;
    }
    // 使用函数名称获取
    if (src.__analyzed && src.__analyzed.functions) {
        for (let func of src.__analyzed.functions) {
            if (func.name === name) {
                return OpenBlock.getFuncGroupByName(src, func.codename);
            }
        }
    }
    // 兼容使用 函数组 名称获取
    return OpenBlock.getFuncGroupByName(src, name);
};
OpenBlock.getStructGroupByName = (src, name) => {
    if (!src) {
        return null;
    }
    for (let s of src.structs) {
        if (s.name === name) {
            return s;
        }
    }
    return null;
};

OpenBlock.getStructGroupByStructName = (src, name) => {
    if (!src) {
        return null;
    }
    // 使用函数名称获取
    if (src.__analyzed && src.__analyzed.structs) {
        for (let s of src.__analyzed.structs) {
            if (s.name === name) {
                return OpenBlock.getStructGroupByName(src, name);
            }
        }
    }
    // 兼容使用 函数组 名称获取
    return OpenBlock.getStructGroupByName(src, name);
};

OpenBlock._buildBlockly = (domContainer, xml, code, env) => {
    let opt = Object.assign({
        plugins: {
            [Blockly.registry.Type.CONNECTION_CHECKER]: "NativeTypeChecker"
        }
    }, OpenBlock.config.blocklyOpt);
    opt.media = OpenBlock.bootPath + '../3rd/blockly/media/';
    opt.toolbox = xml;
    let workspace = Blockly.inject(domContainer, opt);
    const zoomToFit = new ZoomToFitControl(workspace);
    zoomToFit.init();
    workspace.setResizesEnabled(true);
    workspace._openblock_env = env;
    OpenBlock.InitWorkspace(workspace)
    // workspace.addChangeListener(Blockly.Events.disableOrphans);
    // onresize();
    Blockly.svgResize(workspace);
    if (code && code.startsWith('<xml')) {
        Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(code), workspace);
    } else {
        let eventUtils = Blockly.Events;
        eventUtils.fire(new (eventUtils.get(eventUtils.FINISHED_LOADING))(workspace));
    }
    return workspace;
};

OpenBlock._initStateToolbox = (xmlDom, src) => {
    OpenBlock.injectNativeCategory(xmlDom, src);
};

OpenBlock._initFunctionToolbox = (xmlDom, src) => {
    OpenBlock.injectNativeCategory(xmlDom, src);
};

OpenBlock.buildStateBlockly = (src, fsm, state, domContainer) => {
    if (!domContainer) {
        throw new Error('domContainer is null');
    }
    if (src.fsms.indexOf(fsm) < 0) {
        throw new Error('fsm not in src');
    }
    if (fsm.states.indexOf(state) < 0) {
        throw new Error('state not in fsm');
    }
    domContainer.innerHTML = "";

    let xmlDom = Blockly.Xml.textToDom(OpenBlock.config.toolbox.state);
    OpenBlock._initStateToolbox(xmlDom, src);
    let workspace = OpenBlock._buildBlockly(domContainer, xmlDom, state.code, {
        _openblock_src: src,
        _openblock_state: state,
        _openblock_fsm: fsm,
        _openblock_type: 'state',
        _openblock_target: state
    });
    let ret = {
        context: {
            src: src,
            fsm: fsm,
            state: state,
            type: 'state',
            workspace
        },
        value: state,
        resize: function () {
            // workspace.resize();
            Blockly.svgResize(workspace);
        },
        dispose: function () {
            try {
                workspace.dispose();
            } catch (e) {
                console.warn(e);
            }
        },
        saveCode: function () {
            let filename = src.name + '.xs';
            VFS.partition.src.get(filename, v => {
                if (v === src) {
                    state.code = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(workspace));
                    // let srcContent = JSON.stringify(src, OpenBlock.hiddenClear);
                    VFS.partition.src.put(filename, (src));
                } else {
                    console.warn(filename + " not in storage");
                }
            });
        }
    };
    ret.context.workspace.saveCode = ret.saveCode;
    workspace.clearUndo();
    return ret;
};

OpenBlock.buildFunctionBlockly = (src, func, domContainer) => {
    if (!domContainer) {
        throw new Error('domContainer is null');
    }
    if (src.functions.indexOf(func) < 0) {
        throw new Error('function not in source');
    }
    domContainer.innerHTML = "";

    let xmlDom = Blockly.Xml.textToDom(OpenBlock.config.toolbox.function);
    OpenBlock._initFunctionToolbox(xmlDom, src);
    let workspace = OpenBlock._buildBlockly(domContainer, xmlDom, func.code, {
        _openblock_src: src,
        _openblock_function: func,
        _openblock_type: 'function',
        _openblock_target: func
    });
    let ret = {
        context: {
            src: src,
            function: func,
            type: 'function',
            workspace
        },
        value: func,
        resize: function () {
            // workspace.resize();
            Blockly.svgResize(workspace);
        },
        dispose: function () {
            workspace.dispose();
        },
        saveCode: function () {
            let filename = src.name + '.xs';
            VFS.partition.src.get(filename, v => {
                if (v === src) {
                    func.code = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(workspace));
                    // let srcContent = JSON.stringify(src, OpenBlock.hiddenClear);
                    VFS.partition.src.put(filename, (src));
                } else {
                    console.warn(filename + " not in storage");
                }
            });
        }
    };
    ret.context.workspace.saveCode = ret.saveCode;
    workspace.clearUndo();
    return ret;
};
OpenBlock.buildActionGroupBlockly = (src, fsm, func, domContainer) => {
    if (!domContainer) {
        throw new Error('domContainer is null');
    }
    if (src.fsms.indexOf(fsm) < 0) {
        throw new Error('fsm not in src');
    }
    if (fsm.functions.indexOf(func) < 0) {
        throw new Error('function not in fsm');
    }
    domContainer.innerHTML = "";

    let xmlDom = Blockly.Xml.textToDom(OpenBlock.config.toolbox.actionGroup);
    OpenBlock._initFunctionToolbox(xmlDom, src);
    let workspace = OpenBlock._buildBlockly(domContainer, xmlDom, func.code, {
        _openblock_src: src,
        _openblock_fsm: fsm,
        _openblock_function: func,
        _openblock_type: 'actionGroup',
        _openblock_target: func
    });
    let ret = {
        context: {
            src: src,
            function: func,
            fsm: fsm,
            type: 'actionGroup',
            workspace
        },
        value: func,
        resize: function () {
            // workspace.resize();
            Blockly.svgResize(workspace);
        },
        dispose: function () {
            workspace.dispose();
        },
        saveCode: function () {
            let filename = src.name + '.xs';
            VFS.partition.src.get(filename, v => {
                if (v === src) {
                    func.code = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(workspace));
                    // let srcContent = JSON.stringify(src, OpenBlock.hiddenClear);
                    VFS.partition.src.put(filename, (src));
                } else {
                    console.warn(filename + " not in storage");
                }
            });
        }
    };
    ret.context.workspace.saveCode = ret.saveCode;
    workspace.clearUndo();
    return ret;
};
OpenBlock.buildStateBlocklyByName = (srcName, fsmName, stateName, domContainer) => {
    let src = OpenBlock.getSrcByName(srcName);
    let fsm = OpenBlock.getFsmByName(src, fsmName);
    let state = OpenBlock.getStateByName(fsm, stateName);

    return OpenBlock.buildStateBlockly(src, fsm, state, domContainer);
};

OpenBlock.buildFunctionBlocklyByName = (srcName, funcName, domContainer) => {
    let src = OpenBlock.getSrcByName(srcName);
    let func = OpenBlock.getFuncGroupByFunctionName(src, funcName);

    return OpenBlock.buildFunctionBlockly(src, func, domContainer);
};

OpenBlock.hiddenClear = function (k, v) {
    if (!k.startsWith('_')) {
        return v;
    }
}
/**
 * 将指定的源文件序列化为字符串格式
 */
OpenBlock.serializeSrc = (src, cb) => {
    cb(null, JSON.stringify(src, OpenBlock.hiddenClear));
};
/**
 * 将指定的源文件编译为库(blob)
 */
OpenBlock.serializeLib = (src, cb) => {
    if (!src.__analyzed) {
        OpenBlock.BlocklyParser.analyze();
    }
    if (src._errors && src._errors.length > 0) {
        cb(src._errors);
        return;
    }
    OpenBlock.Compiler.compile(src.__analyzed, {}, cb);

};
/**
 * 
 * @param {*} options 
 * @param {Function<void>} cb 
 * @returns Promise<Array<Error>>
 */
OpenBlock.compileAllSrc = async function (options, cb) {
    if (typeof (options) === 'function') {
        cb = options;
        options = {};
    } else if (!cb) {
        cb = function () { };
    }
    if (!options) {
        options = {};
    }
    OpenBlock.BlocklyParser.analyze();
    let errors = [];
    let srcs = OpenBlock.BlocklyParser.loadedFiles.srcs;
    let promises = [];
    for (let i = 0; i < srcs.length; i++) {
        let src = srcs[i];
        let p = new Promise((resolve, reject) => {
            if (true || !src.__compiled) {
                if (options.env) {
                    if (typeof (options.env) == 'string') {
                        options.env = [options.env];
                    }
                } else {
                    options.env = [...src.env];
                }
                // let envs = options.env ? [options.env] : [...src.env];
                // options.env = envs;
                OpenBlock.Compiler.compile(src.__analyzed, options, (err, compiled) => {
                    if (err) {
                        src._errors.push(err);
                        errors.push(err);
                    } else {
                        src.__compiled = compiled;
                    }
                    resolve(err);
                });
            }
        });
        promises.push(p);
    }
    await Promise.all(promises);
    if (cb) {
        cb(errors);
    }
}
/**
 * 
 * @param {Object} options 
 * @param {function} cb 
 * @return Promise<Void>
 */
OpenBlock.exportExePackage = async function (options, cb) {

    let resultP = new Promise((resolveResult, rejectResult) => {
        OpenBlock.saveAllSrc(() => {
            OpenBlock.BlocklyParser.analyze();
            let errors = [];
            let srcs = OpenBlock.BlocklyParser.loadedFiles.srcs;
            if (options.srcList) {
                srcs = srcs.filter(s => options.srcList.indexOf(s.name) >= 0);
            }
            function link() {
                for (let i = 0; i < srcs.length; i++) {
                    let src = srcs[i];
                    if (src._errors && src._errors.length > 0) {
                        errors = errors.concat(src._errors);
                    }
                    if (src.__compiled && src.__compiled.errors && src.__compiled.errors.length > 0) {
                        errors = errors.concat(src.__compiled.errors);
                    }
                }
                if (errors.length > 0) {
                    if (cb) {
                        cb(errors)
                    }
                    rejectResult(errors);
                    return;
                }
                let compiledarr = [];
                // OpenBlock.BlocklyParser.loadedFiles.libs.forEach(l => {
                //     compiledarr.push(l);
                // });
                srcs.forEach(l => {
                    compiledarr.push(l.__compiled);
                });
                try {
                    OpenBlock.DataImporter.reorganizeData();
                    OpenBlock.Linker.link(compiledarr, OpenBlock.DataImporter.dataReorganizingContext,
                        Object.assign({}, OpenBlock.Env.getEnv(options.env),
                            {
                                'buildin': OpenBlock.Env.buildInFunctions,
                                'entry': options.entry
                            }
                        ), (errors, buf) => {
                            if (cb) {
                                cb(errors, buf);
                            }
                            resolveResult(buf);
                        }
                    );
                } catch (e) {
                    rejectResult(e);
                }
            }
            let promises = [];
            for (let i = 0; i < srcs.length; i++) {
                let src = srcs[i];
                let p = new Promise((resolve, reject) => {
                    if (true || !src.__compiled) {
                        try {
                            OpenBlock.Compiler.compile(src.__analyzed, options, (err, compiled) => {
                                if (err) {
                                    src._errors.push(err);
                                    errors.push(err);
                                } else {
                                    src.__compiled = compiled;
                                }
                                resolve();
                            });
                        } catch (e) {
                            reject(e);
                        }
                    }
                });
                promises.push(p);
            }
            return Promise.all(promises).then(() => {
                link();
            }).catch(e => rejectResult(e));
        });
    });
    return resultP;
};
OpenBlock.setAllBlockStyles = (styleArray) => {
    for (let themeName in Blockly.Themes) {
        let theme = Blockly.Themes[themeName]
        for (let k in styleArray) {
            theme.blockStyles[k] = styleArray[k];
        }
    }
};

OpenBlock.setCategoryStyle = (cateName, style) => {
    for (let themeName in Blockly.Themes) {
        let theme = Blockly.Themes[themeName]
        theme.categoryStyles[cateName] = style;
    }
};

OpenBlock.getRelatedSrcOrLib = (src) => {
    let srcArr = [src];
    src.depends.forEach(srcName => {
        let src1 = OpenBlock.getSrcByName(srcName);
        if (src1) {
            srcArr.push(src1);
        } else {
            let lib = OpenBlock.getLibByName(srcName);
            if (lib) {
                srcArr.push(lib);
            } else {
                // throw "找不到依赖项：" + srcName;
            }
        }
    });
    return srcArr;
};
OpenBlock.getAvailableTypes = function (src) {
    let types = [].concat(OpenBlock.I18N.PRIMARY_TYPES);


    let libs = OpenBlock.getRelatedSrcOrLib(src);

    libs.forEach(lib => {
        lib.__analyzed.structs.forEach(st => {
            let fullname = lib.name + "." + st.name;
            types.push([fullname, fullname]);
        });
    });
    OpenBlock.Env.getNativeTypes(src.env).map(t => {
        types.push([OpenBlock.i(t), t]);
    });
    return types;
}

OpenBlock.importProjectZip = function (zipContent, cb) {
    let zip = new JSZip();
    zip.loadAsync(zipContent).then(zip => {
        let promises = [];
        zip.forEach((relpath, file) => {
            if (file.dir) {
                return;
            }
            console.log(relpath);
            let partition = relpath.substring(0, relpath.indexOf('/'));
            let filename = relpath.substring(relpath.lastIndexOf('/') + 1);
            if (partition === 'src' || partition === 'config') {
                promises.push(file.async('string').then(str => {
                    try {
                        VFS.partition[partition].put(filename, JSON.parse(str));
                    } catch (e) {
                        console.warn(e);
                    }
                }));
            } else {
                promises.push(file.async('arraybuffer').then(ab => {
                    try {
                        if (partition && VFS.partition[partition]) {
                            VFS.partition[partition].put(filename, ab);
                        }
                    } catch (e) {
                        console.warn(e);
                    }
                }));
            }
        });
        Promise.all(promises).then(() => {
            OpenBlock.compileAllSrc(() => {
                cb();
            });
        }).catch(e => {
            cb(e);
        });
    });
};
OpenBlock.exportProjectZip = function (cb, zip) {
    if (!zip) {
        zip = new JSZip();
    }
    let partitions = VFS.partition;
    let projectStruct = {};
    for (let key in partitions) {
        projectStruct[key] = [];
        // let part = partitions[key];
        if (key === 'src' || key === 'config') {
            VFS.partition[key].allFiles(arr => {
                arr.forEach(p => {
                    let src = p.content;
                    let name = p.name;
                    projectStruct[key].push(key + '/' + name);
                    OpenBlock.serializeSrc(src, (e, src_str) => {
                        zip.file(key + '/' + name, src_str);
                    });
                });
            });
        } else {
            VFS.partition[key].allFiles(arr => {
                arr.forEach(p => {
                    let data = p.content;
                    let name = p.name;
                    projectStruct[key].push(key + '/' + name);
                    zip.file(key + '/' + name, data, { binary: true });
                });
            });
        }
    }
    zip.file('project.json', JSON.stringify(projectStruct));
    zip.generateAsync({
        type: "blob",
        compression: 'DEFLATE',
        compressionOptions: {
            level: 9
        }
    }).then(function (content) {
        cb(content);
    });
};