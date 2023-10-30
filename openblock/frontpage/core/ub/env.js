
class Env {
    static buildInFunctions = new Map();
    static nativeTypeSingleton = new Map();
    static nativefunctionsSingleton = new Map();
    static eventsingleton = new Map();
    /**
     * @type {Map<String,Env>}
     */
    static instances = new Map();
    static allInstances = new Map();
    static listeners = [];
    static blockConfig = new Map();
    static onChange(f) {
        Env.listeners.push(f);
    }
    static buildinFunctionJson(arr) {
        let env = Env.addNewEnv("");
        for (let i = 0; i < arr.length; i++) {
            let f = arr[i];
            f.libIndex = i;
            if (typeof (f.order) !== 'number') {
                f.order = 0;
            }
        }
        arr.sort((a, b) => a.order - b.order);
        env.initJson(arr, '', '', Env.buildInFunctions);
    }
    static findBuildInFunction(name) {
        let func = Env.buildInFunctions.get('').functions.find(f => {
            return f.fullname === name;
        });
        if (!func) {
            throw Error(OpenBlock.i('找不到内置函数') + ' ' + OpenBlock.i(name));
        }
        return func;
    }
    static _getNF(name) {
        let nf = Env.nativefunctionsSingleton.get(name);
        if (!nf) {
            nf = new Map();
            Env.nativefunctionsSingleton.set(name, nf);
        }
        return nf;
    }
    static _getNT(name) {
        let nt = Env.nativeTypeSingleton.get(name);
        if (!nt) {
            nt = new Map();
            Env.nativeTypeSingleton.set(name, nt);
        }
        return nt;
    }
    static _getET(name) {
        let t = Env.eventsingleton.get(name);
        if (!t) {
            t = new Map();
            Env.eventsingleton.set(name, t);
        }
        return t;
    }
    static registerEvents(envName, name, events) {
        if (Array.isArray(envName)) {
            envName.forEach(n => {
                Env.registerEvents(n, name, events);
            });
            return;
        }
        let et = Env._getET(envName);
        events.forEach(e => {
            if (et.has(e.name)) {
                console.warn('替换事件:' + name);
            }
            et.set(e.name, e);
        });
    }
    static getEvents(envNames) {
        let evts = [];
        for (let envName of envNames) {
            if (!Env.hasEnv(envName)) {
                continue;
            }
            let env = Env.getEnv(envName);
            let _evts = env.events;
            for (let e of _evts.values()) {
                if (evts.indexOf(e) < 0) {
                    evts.push(e);
                }
            }
        }
        return evts;
    }
    /**
     * 注册本地类型
     * @param {string|string[]} envName 
     * @param {[typename:[supertype]]} typeMap 
     */
    static registerNativeTypes(name, typeMap) {
        if (Array.isArray(name)) {
            name.forEach(n => {
                Env.registerNativeTypes(n, typeMap);
            });
            return;
        }
        let nt = Env._getNT(name);
        for (let type in typeMap) {
            if (nt.has(type)) {
                throw Error('注册本地类型重复:' + type);
            }
            nt.set(type, typeMap[type]);
        }
    }
    /**
     * 向指定的环境注册本地函数
     * @param {String|String[]} envName 环境名称
     * @param {String} name 函数库名称
     * @param {String} version 函数库版本号或hash
     * @param {Array<object>} table 函数表
     * @param {Boolean} sorted 内部递归优化用，调用请传false
     */
    static registerNativeFunction(envName, name, version, table, sorted) {
        if (!sorted) {
            for (let i = 0; i < table.length; i++) {
                let f = table[i];
                f.libIndex = i;
                if (typeof (f.order) !== 'number') {
                    f.order = 0;
                }
            }
            table.sort((a, b) => a.order - b.order);
        }
        if (Array.isArray(envName)) {
            envName.forEach(envname => {
                Env.registerNativeFunction(envname, name, version, table, true);
            });
            return;
        }
        let e = Env.getOrNewEnv(envName);
        let nf = Env._getNF(envName);
        e.initJson(table, version, name, nf);
    }
    static addNewEnv(name, hide) {
        let env = Env.instances.get(name);
        if (env) {
            if (!hide) {
                throw Error('重复环境:' + name);
            } else {
                env = Env.allInstances.get(name);
            }
        }
        if (!env) {
            let nt = Env._getNT(name);
            let nf = Env._getNF(name);
            let et = Env._getET(name);
            env = new Env(name, nt, nf, et);
        }
        Env.allInstances.set(name, env);
        if (!hide) {
            Env.instances.set(name, env);
            Env.listeners.forEach(l => l());
        }
        return env;
    }
    static getOrNewEnv(name) {
        let e = Env.instances.get(name);
        if (!e) {
            e = Env.addNewEnv(name, true);
        }
        return e;
    }
    static getEnv(name) {
        let e = Env.instances.get(name);
        if (!e) {
            throw Error('环境不存在:' + name);
        }
        return e;
    }
    static hasEnv(name) {
        let e = Env.instances.get(name);
        return !!e;
    }
    /**
     * 
     * @param {string[]} envNames 
     * @returns Array.<>
     */
    static getAvailabieNativeLibs(envNames) {
        if (envNames.length == 0) {
            return [];
        }
        let lib = new Map();
        for (let i = 0; i < envNames.length; i++) {
            let envName = envNames[i];
            if (!Env.hasEnv(envName)) {
                continue;
            }
            let _env = Env.getEnv(envName);
            let _lib = _env.nativeLib;
            _lib.forEach((l, name) => {
                if (!lib.has(name)) {
                    lib.set(name, l);
                }
            });
        }
        for (let i = 0; i < envNames.length; i++) {
            let envName = envNames[i];
            if (!Env.hasEnv(envName)) {
                continue;
            }
            let _env = Env.getEnv(envName);
            let _lib = _env.nativeLib;
            let remove = [];
            lib.forEach((l, libName) => {
                if (!_lib.has(libName)) {
                    remove.push(libName);
                }
            });
            remove.forEach(k => {
                lib.delete(k);
            });
        }
        return lib;
    }


    static matchNativeFunction(envs, nativeFunc, throws) {
        let f;
        for (let envName of envs) {
            if (!Env.hasEnv(envName)) {
                continue;
            }
            let env = Env.getEnv(envName);
            f = env.checkNativefunctions(nativeFunc, false);
            if (!f) {
                if (throws) {
                    throw { "message": (OpenBlock.i("找不到函数库") + ' ' + OpenBlock.i(nativeFunc.fullname)) };
                } else {
                    return null;
                }
            }
        }
        if (!f) {
            if (throws) {
                throw { "message": (OpenBlock.i("找不到函数库") + ' ' + OpenBlock.i(nativeFunc.fullname)) };
            }
        }
        return f;
    }
    static getNativeTypes(envNames) {
        if (!Array.isArray(envNames)) {
            return Env.getNativeTypes([envNames]);
        }
        let t = [];
        for (let envName of envNames) {
            if (!Env.hasEnv(envName)) {
                continue;
            }
            let env = Env.getEnv(envName);
            let _t = env.nativeTypes;
            _t.forEach((parent, name, _t) => {
                if (t.indexOf(name) < 0) {
                    t.push(name);
                }
            });
        }
        return t;
    }
    static getNativeTypesWithParent(envNames) {
        if (!Array.isArray(envNames)) {
            return Env.getNativeTypesWithParent([envNames]);
        }
        let t = {};
        for (let envName of envNames) {
            if (!Env.hasEnv(envName)) {
                continue;
            }
            let env = Env.getEnv(envName);
            let _t = env.nativeTypes;
            _t.forEach((parent, name, _t) => {
                if (!t[name]) {
                    t[name] = parent;
                }
            });
        }
        return t;
    }
    /**
     * @type {String}
     */
    name;
    nativeTypes;
    nativeLib;
    events;
    constructor(name, nt, nf, et) {
        this.name = name;
        this.nativeTypes = nt;
        this.nativeLib = nf;
        this.events = et;
    }
    initJson(table, libHash, libName, lib) {
        let functions = [];
        table.forEach(f => {
            Env.blockConfig.set(f.method_name, f);
            let fdef = new FunctionDef();
            fdef.setName(f.method_name);
            if (f.returnType) {
                fdef.setReturnType(this.textToValueType(f.returnType));
            }
            if (f.arguments) {
                f.arguments.forEach(a => {
                    let type = this.textToValueType(a.type);
                    let sf = new StructField();
                    if (type) {
                        sf.setType(type);
                    }
                    sf.setName(a.name);
                    fdef.addArg(sf);
                });
            }
            fdef.fullname = f.method_name;
            fdef.scope = 'global';
            fdef.buildSignature();

            fdef.libHash = libHash;
            fdef.libIndex = f.libIndex;
            fdef.libName = libName;
            fdef.blockDefine = f.blockDefine;
            functions.push(fdef);
        });
        let l = { name: libName, hash: libHash, functions };
        lib.set(libName, l);
    }
    nameToValueType(typeName) {
        switch (typeName) {
            case 'Integer':
            case 'Boolean':
            case 'Number':
            case 'Float':
            case 'Colour':
            case 'String':
                let sft = new StructFieldType();
                sft.setName(typeName);
                return sft;
            case 'integer_map':
                return new StructFieldTypeIntegerMap();
            case 'string_map':
                return new StructFieldTypeStringMap();
            case 'list':
                return new StructFieldTypeList();
            case 'FSM':
                let ast = new StructFieldTypeNative();
                ast.setName(typeName);
                return ast;
            default:
                let nativeType = this.nativeTypes.has(typeName);
                if (nativeType) {
                    let ast = new StructFieldTypeNative();
                    ast.setName(typeName);
                    return ast;
                } else {
                    let ast = new StructFieldTypeStruct();
                    ast.setName(typeName);
                    return ast;
                }
        }
    };
    textToValueType(typeName) {
        if ((!typeName) || typeName.length === 0 || typeName === 'void') {
            return null;
        }
        let l = typeName.indexOf('<');
        if (l > 0) {
            let r = typeName.lastIndexOf('>');
            let name = typeName.substr(0, l);
            let type = this.nameToValueType(name);
            let elemTypeName = typeName.substring(l + 1, r);
            let elemType = this.textToValueType(elemTypeName);
            type.setElementType(elemType);
            return type;
        } else {
            return this.nameToValueType(typeName);
        }
    }

    checkNativefunctions(func, throws) {
        let libName = func.libName;
        let libHash = func.libHash;
        let libIndex = func.libIndex;
        let lib = this.nativeLib.get(libName);
        if (!lib) {
            if (throws) {
                throw { "message": (OpenBlock.i("找不到函数库") + ' ' + OpenBlock.i(func.fullname)) };
            } else {
                return null;
            }
        }
        if (lib.hash != libHash) {
            console.log("函数库版本不一致 " + libName + "/" + libHash);
        }
        let libfunc = lib.functions.find(f => f.libIndex === libIndex);
        if (!libfunc || libfunc.fullname != func.fullname) {
            // console.log("函数索引已经发生改变" + func.fullname);
            libfunc = lib.functions.find(f => f.fullname === func.fullname);
            if (!libfunc) {
                if (throws) {
                    throw { "message": ("找不到函数 " + func.fullname) };
                } else {
                    return null;
                }
            }
        }
        // if (libfunc.signature !== func.signature) {
        //     console.warn("函数签名已经改变");
        // }
        return libfunc;
    }

}
OpenBlock.Env = Env;
