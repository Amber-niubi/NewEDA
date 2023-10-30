/**
 * @license
 * Copyright 2021 Du Tian Wei
 * SPDX-License-Identifier: Apache-2.0
 */
import bitcodeToC from './bitcode2c.mjs';
import { toASCII, nameToASCII, lengthUTF8 } from './utils.mjs'
function makeRandomVarName(prefix) {
    let r = Math.random() * Number.MAX_SAFE_INTEGER;
    let rn = Math.floor(r).toString(36);
    return prefix + rn;
}
function obType2CType(typename) {
    switch (typename) {
        case 'FSM':
            return 'FSM_PTR';
        case 'Number':
            return 'double';
        case 'Integer':
        case 'Boolean':
            return 'long';
        case 'String':
            return 'STR_PTR';
    }
    return toASCII(typename);
}
function blockIdToComment(id) {
    return id.replaceAll('*', '米');
}
function pushDebugInfo(bc, code, codename, idx) {
    let id = bc.ast ? bc.ast.blockId : bc.blockId;
    if (!id) {
        return;
    }
    if (idx) {
        idx = '/ ' + idx;
    } else {
        idx = '';
    }
    code.push(` /* blockId: ${blockIdToComment(id)}  ${codename} ${idx}*/`);
    code.push(`printf("%s\\n","${blockIdToComment(id)} - ${codename} ${idx}");`);
}
class CContext {
    indentStep = 4;
    indent = 4;
    /** @type Array<string> */
    stringConstPool;
    module; fsm; state;
    root; define;
    /**
     * @type {Object<String,Bitcode[]>}
     */
    moduleBitcode;
    type;
    signature;
    registers = {
        integer: [],
        float: [],
        string: [],
        object: [],
        Nobject: []
    };
}

let preprocess = {
    getStr(str, args, ncall) {
        return `getStrPtr(vm,${parseInt(args[0]) + 1},${ncall.args.length},${str})`;
    }
}
export default class ToC {
    static template;
    /**
     * 
     * @param {Object} options {pyVersion:'3.0'}
     * @returns String
     */
    static async buildLogicSrc(options) {
        let c = await ToC.genCode(options);
        return c;
    }
    static async genCode(options) {
        // 为了验证语法、关联，必须走一遍打包，但是返回值可忽略
        await OpenBlock.exportExePackage(options);
        let srcList = OpenBlock.BlocklyParser.loadedFiles.srcs
            .filter(s => options.srcList.indexOf(s.name) >= 0);
        let importLib = [];
        let stringConstPool = [];
        srcList = srcList.map((src, i, a) => {
            src.__compiled.nativeLibs.forEach(lib => {
                importLib[lib.libname] = true;
            });
            stringConstPool = stringConstPool.concat(Object.keys(src.__compiled.relocation.string));
            return Object.assign({}, src.__analyzed, { bitcode: src.__compiled.bitcode });
        });
        stringConstPool.sort((a, b) => lengthUTF8(a) - lengthUTF8(b));
        importLib = Object.keys(importLib);
        let entry = null;
        if (options.entry) {
            let e = options.entry.split('.');
            entry = { module: e[0], fsm: e[1] };
        }
        return ToC.template({
            stringConstPool,
            importLib,
            srcList,
            entry
        }, {
            partials: options.partials,
            helpers: {
                base64(str) {
                    if (typeof (str) == 'undefined') {
                        debugger
                        return '!!!!!!!! undefined !!!!!!!!!!'
                    }
                    return toASCII(str);
                },
                argtype(args) {
                    return args.join('_');
                },
                argtypebase64(args) {
                    return args.map(a => {
                        return toASCII(a);
                    }).join('_');
                },
                /**
                 * 
                 * @param {StatementDef} body 
                 */
                functionBody(define, indent, module, fsm, state, moduleBitcode, type, root) {
                    let ctx = new CContext();
                    ctx.define = define;
                    ctx.stringConstPool = stringConstPool;
                    ctx.moduleBitcode = moduleBitcode;
                    ctx.indent = indent;
                    ctx.module = module;
                    ctx.fsm = fsm;
                    ctx.state = state;
                    ctx.root = root;
                    ctx.type = type;
                    return define.body.toC(ctx);
                },
                toStringValue(str) {
                    return '"' + str.split('\n').join('\\n') + '"';
                },
                length(arr) {
                    return arr.length;
                },
                rand() {
                    return Math.floor(Math.random() * 10000);
                },
                ctype: obType2CType,
                followArgs(args) {
                    // let arglst = ()
                    if (args.length > 0) {
                        return ',' + args.map(
                            (a, i) => obType2CType(a.type.name) + ' arg' + i)
                            .join(',');
                    }
                    return '';
                },
                nameToASCII,
                functionReturnType() {
                    if (this.returnType) {
                        return obType2CType(this.returnType.name);
                    } else {
                        return 'void';
                    }
                }
            }
        });
    }
}

OpenBlock.onInited(async () => {
    await OpenBlock.Utils.loadJSAsync('../jsruntime/developtools/handlebars.js');
    ToC.template = Handlebars.compile((await axios({ url: '../jsruntime/developtools/c/c.handlebars' })).data);

    StatementDef.prototype.toC = function (ctx) {
        let indentCnt = ctx.indent;
        let indent = "".padStart(indentCnt, ' ');
        let s = ctx.type + '_' + ctx.module.name + '.';
        if (ctx.fsm) {
            s += ctx.fsm.name + '.';
            if (ctx.state) {
                s += ctx.state.name + '.';
            }
        }
        s += ctx.define.name;
        s +=
            '(' + ctx.define.args.map(a => { return 'S' + a.type.name + ';' }).join() + ')'
            + (ctx.define.returnType ? 'S' + ctx.define.returnType.name + ';' : "v");
        let bitcodeData = ctx.moduleBitcode[s];
        if (!bitcodeData) {
            console.log(s, bitcodeData);
            debugger;
            throw Error('找不到字节码');
        }
        let bitcode = bitcodeData.data;
        let exp_end = bitcode.length - 12;
        let end = bitcode[bitcode.length - 1].integer;
        if (end != exp_end) {
            throw Error('字节码版本不支持');
        }
        let nameIdx = bitcode[end];
        let code = [`/* ${nameIdx.str} */`];
        {
            // let intRegCnt = bitcode[end + 1].integer;
            // if (intRegCnt > 0)
            //     code.push(`IntegerReg integerReg[${intRegCnt}] = {0};`);
            // let flostRegCnt = bitcode[end + 2].integer;
            // if (flostRegCnt > 0)
            //     code.push(`FloatReg floatReg[${flostRegCnt}] = {0};`);
            // let stringRegCnt = bitcode[end + 3].integer;
            // if (stringRegCnt > 0)
            //     code.push(`StringReg stringReg[${stringRegCnt}] = {0};`);
            // let objRegCnt = bitcode[end + 4].integer;
            // if (objRegCnt > 0)
            //     code.push(`ObjectReg objectReg[${objRegCnt}] = {0};`);
            // let NobjRegCnt = bitcode[end + 5].integer;
            // if (NobjRegCnt > 0)
            //     code.push(`NobjectReg NobjectReg[${NobjRegCnt}] = {0};`);

            let intVarCnt = bitcode[end + 6].integer;
            if (intVarCnt > 0)
                code.push(`long integerVar[${intVarCnt}] = {0};`);
            let flostVarCnt = bitcode[end + 7].integer;
            if (flostVarCnt > 0)
                code.push(`double floatVar[${flostVarCnt}] = {0};`);
            let stringVarCnt = bitcode[end + 8].integer;
            if (stringVarCnt > 0)
                code.push(`STR_PTR stringVar[${stringVarCnt}] = {0};`);
            let objVarCnt = bitcode[end + 9].integer;
            if (objVarCnt > 0)
                code.push(`void* objectVar[${objVarCnt}] = {0};`);
            let NobjVarCnt = bitcode[end + 10].integer;
            if (NobjVarCnt > 0)
                code.push(`void* NobjectVar[${NobjVarCnt}] = {0};`);
        }
        let args = { integer: 0, float: 0, string: 0, object: 0, Nobject: 0 };
        for (let i = 0; i < ctx.define.args.length; i++) {
            let arg = ctx.define.args[i];
            let argType = arg.type.name;
            switch (argType) {
                case 'Number':
                    argType = 'float';
                    break;
                case 'Integer':
                    argType = 'integer';
                    break;
                case 'String':
                    argType = 'string';
                    break;
                // TODO Object,Nobject
                default:
                    throw Error('尚未支持的类型');
            }
            code.push(`${argType}Var[${args[argType]}] = arg${i};`);
            args[argType]++;
        }

        for (let i = 0; i < end; i++) {
            let bc = bitcode[i];
            let codename = bc.codename || bc.$__type;
            let codeComponent = bitcodeToC[codename];
            if (!codeComponent) {
                // throw Error(`${codename} 未实现`);
                console.warn(`${codename} 未实现`);
            } else {
                let inst = codeComponent(bc, ctx, bitcode, i, bitcodeData.from);
                let rettype = typeof (inst);
                if (rettype == 'undefined') {
                    // console.warn(`${codename} 未生成代码`);
                } else if (rettype == 'string') {
                    code.push(`pos${i}:`);
                    pushDebugInfo(bc, code, codename);
                    code.push(inst);
                } else if (Array.isArray(inst)) {
                    code.push(`pos${i}:`);
                    inst.forEach((i, idx) => {
                        pushDebugInfo(bc, code, codename, idx);
                        code.push(i);
                    });
                }
            }
        }
        // let v = this.variables.map(v => {
        //     return indent + `// blockId: ${v.blockId}\n` + indent + v.toInst(ctx);
        // });
        // let c = this.instructions.map(i => {
        //     let r = i.toInst(ctx);
        //     if (Array.isArray(r)) {
        //         return r.map(l => indent + l).join('\n');
        //     }
        //     return indent + r;
        // });
        // return v.join('\n') + '\n' + c.join('\n');
        return code.join("\n" + indent);
    };
});