/**
 * @license
 * Copyright 2021 Du Tian Wei
 * SPDX-License-Identifier: Apache-2.0
 */

Blockly.Blocks['native_call'] = {
    init() {
        this.setStyle("native_call");
    },
    mutationToDom() {
        let dom = Blockly.utils.xml.createElement('mutation');
        let node = Blockly.utils.xml.createTextNode(this.mutation);
        dom.appendChild(node);
        return dom;
    },
    domToMutation(xml) {
        if (xml && xml.textContent) {
            this.mutation = xml.textContent;
            this.mutationData = JSON.parse(decodeURI(this.mutation), Deserializer);
            this.appendDummyInput().appendField(OpenBlock.i(this.mutationData.func.fullname)
                + (this.mutationData.func.returnType ? (":" + OpenBlock.i(this.mutationData.func.returnType.toCodeText())) : ""));
            this.updateBlock();
        }
    },
    getConfig(fieldName) {
        let b = OpenBlock.NativeBlockProviderConfig[this.mutationData.func.fullname];
        if (b) {
            return b[fieldName];
        }
    },
    updateBlock() {
        let src = (this.workspace.targetWorkspace || this.workspace)._openblock_env._openblock_src;
        let func = OpenBlock.Env.matchNativeFunction(src.env, this.mutationData.func, false);
        if (func) {
            this.mutationData.func = func;
            this.setWarningText();
        } else {
            func = this.mutationData.func;
            this.setWarningText("函数不可用，请检查环境配置或者使用其他块代替。");
        }
        let block = this;
        Blockly.Events.disable();
        if (func.returnType && !this.mutationData.ignoreReturnValue) {
            if (block.nextConnection && block.nextConnection.isConnected()) {
                block.nextConnection.disconnect();
            }
            block.setNextStatement(false);
            if (block.previousConnection && block.previousConnection.isConnected()) {
                block.previousConnection.disconnect();
            }
            block.setPreviousStatement(false);
            block.setOutput(true, func.returnType.toCodeText());
        } else {
            if (block.outputConnection && block.outputConnection.isConnected()) {
                block.outputConnection.disconnect();
            }
            block.setOutput(false);
            block.setNextStatement(true, 'inst');
            block.setPreviousStatement(true, 'inst');
        }
        for (let i = 0; i < func.args.length; i++) {
            let input = block.inputList[1 + i];
            let arg = func.args[i];
            let type;
            let checkType;
            if (arg.type) {
                if (!arg.type.toCodeText) {
                    debugger
                }
                type = arg.type.toCodeText();
                checkType = type;
                if (checkType == 'Number') {
                    checkType = ['Number', 'Integer'];
                }
            }
            if (input) {
                input.fieldRow[0].setValue(OpenBlock.i(arg.name) + ":" + OpenBlock.i(type));
                input.setCheck(checkType);
            }
            else {
                let name = arg.name;
                let input = block.appendValueInput(name);
                input.setAlign(Blockly.ALIGN_RIGHT).setCheck(checkType);
                input.appendField(OpenBlock.i(arg.name) + ":" + OpenBlock.i(type));
                if (!input.connection.isConnected() && this.workspace.isFlyout) {
                    let conf = this.getConfig(name);
                    if (conf) {
                        let blk = conf.makeBlock(this.workspace, type, name, input);
                        blk.setShadow(true);
                        input.connection.connect(blk.outputConnection);
                    }
                }
            }
        }
        while (block.inputList.length > func.args.length + 1) {
            let input = block.inputList[block.inputList.length - 1];
            if (input.connection && input.connection.isConnected()) {
                input.connection.disconnect();
            }
            block.removeInput(input.name);
        }
        Blockly.Events.enable();
    }
};
Blockly.Blocks['fsm_provider'] = {
    init: function () {
        this.jsonInit({
            "type": "fsm_provider",
            "message0": "%1",
            "args0": [{
                "type": "field_dropdown_fsm_list",
                "name": "FSM"
            }],
            "output": "String",
            "style": "control_blocks",
            "tooltip": "",
            "helpUrl": ""
        });
    }
};
Blockly.Blocks['empty_provider'] = {
    init: function () {
        this.jsonInit({
            "style": "variable_blocks",
            "output": ["String", "Number"]
        });
    },
    mutationToDom() {
        let dom = Blockly.utils.xml.createElement('mutation');
        let node = Blockly.utils.xml.createTextNode(this.mutation);
        dom.appendChild(node);
        return dom;
    },
    domToMutation(xml) {
        if (xml && xml.textContent) {
            this.mutation = xml.textContent;
            this.updateBlock();
        }
    },
    updateBlock() {
        let mutationData = JSON.parse(decodeURI(this.mutation), Deserializer);
        let parentType = mutationData.parentType;
        let arg = mutationData.argName;
        let blkprovider = OpenBlock.NativeBlockProviderConfig[parentType];
        if (blkprovider) {
            /**
             * @type {OB_DropdownProvider}
             */
            let provider = blkprovider[arg];
            if (provider) {
                this.setOutput(true, mutationData.checkType);
                let subinput = this.appendDummyInput();
                subinput.appendField(new Blockly.FieldDropdown(provider.options), 'VALUE');
            } else {
                console.warn('找不到本地块供给 ' + parentType + ":" + arg);
            }
        } else {
            console.warn('找不到本地块供给 ' + parentType);
        }
    }
};
/**
 * 参数供给
 * 
 * 为本地函数中需要的参数提供可视化的内容编辑方法
 * 
 */
class OB_NativeBlockArgumentProvider {
    /**
     * 
     * @param {xmldom} blockDom 本地块xml配置中的block节点
     * @param {xmldom} providerCfg 本地块配置中的provider配置
     */
    init(fieldName, blockDom, providerCfg) { }
    /**
     * 
     * @param {Blockly.Workspace} workspace
     * @param {String} checkType 需要的类型
     * @param {String} inputName input名称
     * @param {Blockly.Input} input input对象
     */
    makeBlock(parentBlock, checkType, inputName, input) { }
}
class OB_FSMNameProvider extends OB_NativeBlockArgumentProvider {
    /**
     * 
     * @param {Blockly.Workspace} workspace
     * @param {String} checkType 需要的类型
     * @param {String} inputName input名称
     * @param {Blockly.Input} input input对象
     */
    makeBlock(workspace, checkType, inputName, input) {
        if (checkType && checkType !== 'String') {
            throw Error('fsm 供给只支持字符串类型');
        }
        let blk = workspace.newBlock('fsm_provider');
        return blk;
    }
}
class OB_DropdownProvider extends OB_NativeBlockArgumentProvider {
    /**
     * 下拉列表的选项
     * @type {Array.<Object.<string,String>>|Function} 国际化->返回值的键值对
     */
    options;
    /**
     * @type {String}
     */
    arg;
    /**
     * @type {String}
     */
    parentBlockType;
    /**
     * value/ref
     * @type {string}
     */
    eleType;
    /**
     * 
     * @param {xmldom} blockDom 本地块xml配置中的block节点
     * @param {xmldom} providerCfg 本地块配置中的provider配置
     */
    init(fieldName, blockDom, providerCfg) {
        let optionValues = providerCfg.property;
        this.eleType = providerCfg.eleType || 'value';
        if (typeof (optionValues) == 'function') {
            this.options = optionValues;
        } else if (!Array.isArray(optionValues)) {
            throw Error(OpenBlock.i('没有从设定的属性中得到数组:') + (optionValues));
        } else {
            this.options = optionValues.map(x => {
                // 兼容blockly标准的表达方式
                if (Array.isArray(x)) {
                    x[1] = String(x[1]);
                    return x;
                }
                // OpenBlock定义的拆分值和国际化的表达方式
                return [OpenBlock.i(x), String(x)]
            });
        }
        this.arg = fieldName;
        this.parentBlockType = blockDom.getAttribute('nativeCall');
    }
    /**
     * 
     * @param {Blockly.Workspace} workspace
     * @param {String} checkType 需要的类型
     * @param {String} inputName input名称
     * @param {Blockly.Input} input input对象
     */
    makeBlock(workspace, checkType, inputName, input) {
        if (this.eleType == 'ref') {

        } else if (this.eleType == 'value') {
            if (!checkType) {
                checkType = 'String';
            }
            if (checkType !== 'String' && checkType !== 'Number' && checkType !== 'Integer') {
                throw Error('dropdown 供给只支持字符串、整数和数字类型');
            }
        }
        let blk = workspace.newBlock('empty_provider');
        blk.mutation = JSON.stringify({ parentType: this.parentBlockType, argName: this.arg, checkType, eleType: this.eleType });
        blk.updateBlock();
        return blk;
    }
}
class OB_FileProvider extends OB_NativeBlockArgumentProvider {
    /**
     * 下拉列表的选项
     * @type {Array.<Object.<string,String>>|Function} 国际化->返回值的键值对
     */
    options;
    /**
     * @type {String}
     */
    arg;
    /**
     * @type {String}
     */
    parentBlockType;
    mediaType;
    /**
     * 
     * @param {xmldom} blockDom 本地块xml配置中的block节点
     * @param {xmldom} providerCfg 本地块配置中的provider配置
     */
    init(fieldName, blockDom, providerCfg) {
        this.mediaType = providerCfg.mediaType;
        this.arg = fieldName;
        this.parentBlockType = blockDom.getAttribute('nativeCall');
        this.options = this._options.bind(this);
    }
    /**
     * 
     * @param {Blockly.Workspace} workspace
     * @param {String} checkType 需要的类型
     * @param {String} inputName input名称
     * @param {Blockly.Input} input input对象
     */
    makeBlock(workspace, checkType, inputName, input) {
        if (checkType && checkType !== 'String') {
            throw Error('dropdown 供给只支持字符串类型');
        }
        let blk = workspace.newBlock('empty_provider');
        blk.mutation = JSON.stringify({ parentType: this.parentBlockType, argName: this.arg, checkType });
        blk.updateBlock();
        return blk;
    }
    _options() {
        let ret = [];
        if (VFS.partition.assets) {
            VFS.partition.assets.allFiles((arr) => {
                arr.forEach(f => {
                    if (OpenBlock.Utils.mediaType(f.name) == this.mediaType) {
                        ret.push([f.name, f.name]);
                    }
                });
            });
        }
        if (ret.length == 0) {
            ret.push(['', '']);
        }
        return ret;
    }
}

class OB_NumberProvider extends OB_NativeBlockArgumentProvider {
    value;
    init(fieldName, blockDom, providerCfg) {
        this.value = parseFloat(providerCfg.value);
    }
    /**
     * 
     * @param {Blockly.Workspace} workspace
     * @param {String} checkType 需要的类型
     * @param {String} inputName input名称
     * @param {Blockly.Input} input input对象
     */
    makeBlock(workspace, checkType, inputName, input) {
        if (checkType && checkType !== 'Number') {
            throw Error('Number 供给只支持数字类型');
        }
        let blk = workspace.newBlock('math_number');
        blk.setFieldValue(this.value, 'NUM')
        return blk;
    }
}
class OB_IntegerProvider extends OB_NativeBlockArgumentProvider {
    value;
    init(fieldName, blockDom, providerCfg) {
        this.value = parseInt(providerCfg.value);
    }
    /**
     * 
     * @param {Blockly.Workspace} workspace
     * @param {String} checkType 需要的类型
     * @param {String} inputName input名称
     * @param {Blockly.Input} input input对象
     */
    makeBlock(workspace, checkType, inputName, input) {
        if (checkType && checkType !== 'Integer' && checkType != 'Number') {
            throw Error('Integer 供给只支持数字或整数类型');
        }
        let blk = workspace.newBlock('math_integer');
        blk.setFieldValue(this.value, 'NUM')
        return blk;
    }
}
class OB_StringProvider extends OB_NativeBlockArgumentProvider {
    value;
    init(fieldName, blockDom, providerCfg) {
        this.value = providerCfg.value;
    }
    /**
     * 
     * @param {Blockly.Workspace} workspace
     * @param {String} checkType 需要的类型
     * @param {String} inputName input名称
     * @param {Blockly.Input} input input对象
     */
    makeBlock(workspace, checkType, inputName, input) {
        if (checkType && checkType !== 'String') {
            throw Error('String 供给只支持字符串类型');
        }
        let blk = workspace.newBlock('text');
        blk.setFieldValue(this.value, 'TEXT')
        return blk;
    }
}
class OB_ColorProvider extends OB_NativeBlockArgumentProvider {
    value;
    init(fieldName, blockDom, providerCfg) {
        this.value = providerCfg.value || '#ff0000';
    }
    /**
     * 
     * @param {Blockly.Workspace} workspace
     * @param {String} checkType 需要的类型
     * @param {String} inputName input名称
     * @param {Blockly.Input} input input对象
     */
    makeBlock(workspace, checkType, inputName, input) {
        if (checkType && checkType !== 'Colour') {
            throw Error('Color 供给只支持颜色类型');
        }
        let blk = workspace.newBlock('colour_picker');
        blk.setFieldValue(this.value, 'COLOUR')
        return blk;
    }
}
class OB_BooleanProvider extends OB_NativeBlockArgumentProvider {
    value;
    init(fieldName, blockDom, providerCfg) {
        this.value = !!providerCfg.value;
    }
    /**
     * 
     * @param {Blockly.Workspace} workspace
     * @param {String} checkType 需要的类型
     * @param {String} inputName input名称
     * @param {Blockly.Input} input input对象
     */
    makeBlock(workspace, checkType, inputName, input) {
        if (checkType && checkType !== 'Boolean') {
            throw Error('Boolean 供给只支持布尔类型');
        }
        let blk = workspace.newBlock('logic_boolean');
        blk.setFieldValue(this.value, 'BOOL')
        return blk;
    }
}
(function () {
    /**
     * 参数 provider 映射
     * 名称->类
     * @type {Object.<string,typeof(OB_NativeBlockArgumentProvider)>}
     */
    OpenBlock.NativeFieldProviders = {
        'fsm': OB_FSMNameProvider,
        'dropdown': OB_DropdownProvider,
        'file': OB_FileProvider,
        'Number': OB_NumberProvider,
        'Integer': OB_IntegerProvider,
        'String': OB_StringProvider,
        'Colour': OB_ColorProvider,
        'Boolean': OB_BooleanProvider
    };
    let providerInstance = [];
    /**
     * 
     * @param {String} name 
     * @param {Type} clazz 
     */
    OpenBlock.registerFieldProvider = function (name, clazz) {
        if (OpenBlock.NativeFieldProviders[name]) {
            console.warn('Provider already exist:' + name);
        }
        OpenBlock.NativeFieldProviders[name] = clazz;
    }
    /**
     * 本地函数名 -> 参数名称 -> 供给
     * @type {Object.<string,Object.<string,OB_NativeBlockArgumentProvider>>}
     */
    OpenBlock.NativeBlockProviderConfig = {}

    OpenBlock.injectNativeCategory = function (xmlDom, src) {
        let nativeLibs = OpenBlock.Env.getAvailabieNativeLibs(src.env);
        nativeLibs.forEach((lib, libName, libs) => {
            let funcs = lib.functions;
            if (funcs.length == 0) {
                return;
            }
            // 添加分类
            let gdom = Blockly.utils.xml.createElement('category');
            gdom.setAttribute('name', OpenBlock.i(libName));
            xmlDom.append(gdom);
            funcs.forEach(func => {
                // 添加块
                let dom = Blockly.utils.xml.createElement('block');
                dom.setAttribute("type", "native_call");
                dom.setAttribute('nativeCall', func.fullname);
                if (func.style) {
                    dom.setAttribute('style', func.style);
                }
                let mutation = Blockly.utils.xml.createElement('mutation');
                let txt = encodeURI(JSON.stringify({ func: func, ignoreReturnValue: false }))
                mutation.textContent = txt;
                let blockConf = OpenBlock.Env.blockConfig.get(func.fullname);
                if (blockConf.arguments) {
                    for (argument of blockConf.arguments) {
                        if (argument.provider && argument.provider.type) {
                            // 创建 arg provider
                            let blockconfig = OpenBlock.NativeBlockProviderConfig[func.fullname];
                            if (!blockconfig) {
                                blockconfig = {};//argument.provider;
                                OpenBlock.NativeBlockProviderConfig[func.fullname] = blockconfig;
                            }
                            let providerClass = OpenBlock.NativeFieldProviders[argument.provider.type];
                            if (!providerClass) {
                                throw Error(`no providerClass named ${argument.provider.type} by ${func.fullname}`);
                            }
                            let provider = new providerClass();
                            provider.init(argument.name, dom, argument.provider);
                            providerInstance.push(provider);
                            blockconfig[argument.name] = provider;
                        } else if (!argument.noShadow) {
                            let conf;
                            switch (argument.type) {
                                case 'Integer':
                                    conf = { value: 1 };
                                    break;
                                case 'Number':
                                    conf = { value: 1 };
                                    break;
                                case 'String':
                                    conf = { value: '' };
                                    break;
                                case 'Colour':
                                    conf = { value: '#ffffff' };
                                    break;
                            }
                            if (conf) {
                                let blockconfig = OpenBlock.NativeBlockProviderConfig[func.fullname];
                                if (!blockconfig) {
                                    blockconfig = {};//argument.provider;
                                    OpenBlock.NativeBlockProviderConfig[func.fullname] = blockconfig;
                                }
                                let providerClass = OpenBlock.NativeFieldProviders[argument.type];
                                if (!providerClass) {
                                    throw Error(`no providerClass named ${argument.provider.type} by ${func.fullname}`);
                                }
                                let provider = new providerClass();
                                provider.init(argument.name, dom, conf);
                                providerInstance.push(provider);
                                blockconfig[argument.name] = provider;
                            }
                        }
                    }
                }
                dom.appendChild(mutation);
                // let dom = Blockly.Xml.textToDom(child);
                gdom.append(dom);
            });
        });
    };

    /**
     * <block type="on_event">
     *    <mutation eventname="OnTriggerEnter" style="event_blocks" argtype="UnityEngine.Collider"></mutation>
     * </block>
     * @param {*} workspace 
     * @returns 
     */
    OpenBlock.Blocks.native_event_flyout = function (workspace) {
        var xmlList = [];
        var b = Blockly.utils.xml.createElement('block');
        b.setAttribute('type', 'on_event');
        var m = Blockly.utils.xml.createElement('mutation');
        m.setAttribute('eventname', "Start");
        m.setAttribute('style', "event_blocks");
        b.appendChild(m);
        xmlList.push(b);

        b = Blockly.utils.xml.createElement('block');
        b.setAttribute('type', 'on_event');
        m = Blockly.utils.xml.createElement('mutation');
        m.setAttribute('eventname', "Restore");
        m.setAttribute('style', "event_blocks");
        b.appendChild(m);
        xmlList.push(b);
        let src = (workspace.targetWorkspace || workspace)._openblock_env._openblock_src;
        OpenBlock.Env.getEvents(src.env).forEach(e => {
            var b = Blockly.utils.xml.createElement('block');
            b.setAttribute('type', 'on_event');
            var m = Blockly.utils.xml.createElement('mutation');
            m.setAttribute('eventname', e.name);
            m.setAttribute('style', e.style || "event_blocks");
            if (e.argType) {
                m.setAttribute('argtype', e.argType);
            }
            b.appendChild(m);
            xmlList.push(b);
        });
        return xmlList;
    };
    function assets(workspace) {
        let xmlList = [];
        let str_dom = [];
        var testWorkspace = new Blockly.Workspace();
        testWorkspace.targetWorkspace = workspace;
        providerInstance.forEach(pd => {
            let b = pd.makeBlock(testWorkspace);
            let d = (Blockly.Xml.blockToDom(b));
            d.removeAttribute('id');
            let t = Blockly.Xml.domToText(d);
            if (str_dom.indexOf(t) < 0) {
                str_dom.push(t);
            } else { return; }
            xmlList.push(d);
        });
        testWorkspace.dispose();
        return xmlList;
    }
    OpenBlock.Blocks.build_native_event_flyout = function (workspace) {
        workspace.registerToolboxCategoryCallback('NATIVE_EVENT_CATEGROY', OpenBlock.Blocks.native_event_flyout);
        workspace.registerToolboxCategoryCallback('ASSETS', assets);
    };
    OpenBlock.wsBuildCbs.push(OpenBlock.Blocks.build_native_event_flyout);
})();