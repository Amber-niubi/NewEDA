function commentToXML(comment) {
    if (comment && comment.text) {
        return `<comment pinned="${!!comment.pinned}" h="${comment.h ? comment.h : 80}" w="${comment.w ? comment.w : 160}">${comment.text}</comment>`;
    }
    return '';
}
function XMLToNext(xml) {
    if (xml) {
        return `<next>${xml}</next>`;
    } else {
        return '';
    }
}
OpenBlock.onInited(() => {
    StructDef.prototype.toXML = function (x, y) {
        let ele;
        for (let i = this.fields.length - 1; i >= 0; i--) {
            let c_ele = this.fields[i];
            ele = c_ele.toXML(ele);
        }
        return `<block type="struct" x="${x ? x : 0}" y="${y ? y : 0}">${commentToXML(this.comment)}<field name="NAME">${this.name}</field><statement name="FIELDS">${ele}</statement></block>`;
    };
    StructField.prototype.toXML = function (next) {
        let ele = this.type.toXML();
        return `<block type="struct_field">${commentToXML(this.comment)}<field name="NAME">${this.name}</field><value name="TYPE">${ele}</value>${XMLToNext(next)}</block>`;
    };
    StructFieldType.prototype.toXML = function () {
        return `<block type="struct_base_type">${commentToXML(this.comment)}<field name="TYPE">${this.name}</field></block>`;
    };
});
export class ASTBase {
    comment = '';
}
export class StructGroup {
    ast;
    codename;
    constructor(ast, codename) {
        this.ast = ast;
        this.codename = codename;
    }
    addStruct(name) {
        if (OpenBlock.Utils.hasName(this.ast, name)) {
            throw Error('重复名称:' + name);
        }
        let def = new StructDef();
        def.name = name;
        this.ast.push(def);
    }
    toXML() {
        let elements = this.ast.map((a, i) => a.toXML(i * 500, 0)).join();
        let xml = `<xml xmlns="https://developers.google.com/blockly/xml">${elements}</xml>`;
        return xml;
    }
}
export class CodeGen {
    static loadStruct(strCode, codename, module) {
        let g = OpenBlock.BlocklyParser.parseXML(strCode, codename, module);
        return new StructGroup(g.structs, codename);
    }
    static loadState(strCode, module) {
        let s = OpenBlock.BlocklyParser.parseXML(strCode, null, module);
        let s1 = new StateDef();
        s1.name = module.name;
        s1.comment = module.comment;
        s1.type = module.type;
        s1.eventHandlers = s.eventHandlers;
        s1.functions = s.functions;
        s1.messageHandlers = s.messageHandlers;
        s1.variables = s.variables;
        return s1;
    }
    static loadFunctions(strCode) { }
    static loadSrc(module) {
        switch (module.type) {
            case 'struct':
                return CodeGen.loadStruct(module.code, null, module);
            case 'state':
                return CodeGen.loadState(module.code, module);
            default:
                throw Error('尚未支持的类型: ' + module.type);
        }
    }
}