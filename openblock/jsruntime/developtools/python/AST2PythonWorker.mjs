/**
 * @license
 * Copyright 2021 Du Tian Wei
 * SPDX-License-Identifier: Apache-2.0
 */

var OpenBlock = {};
importScripts('../workerUtils.js')
importScripts('../../../frontpage/core/ub/compiler/AST/SObject/Serializable.js');
importScripts('../../../frontpage/core/ub/compiler/AST/ModuleAST.js');
importScripts('../../../jsruntime/developtools/template.js');
let template;
onmessage = (e) => {
    try {
        let data = JSON.parse(e.data, Deserializer);
        template = data.template;
        let ast = data.ast;
        let pc = new PythonContext();
        ast.toPython(pc);
        let code = pc.genCode();
        postMessage({ code, result: 'success' });
    } catch (e) {
        console.error(e);
        postMessage({ result: 'fail', error: e });
    }
    setTimeout(() => {
        close();
    }, 30000);
}
class PythonContext {
    code = []
    module;
    fsm;
    state;
    obfunction;
    Indent = 0;
    addCode(str) {
        this.code.push(Array.from(Array(this.Indent * 4), () => ' ').join('') + str);
    }
    genCode() {
        return this.code.join('\n');
    }
}
function defaultPythonValueOfOBType(type) {
    switch (type) {
        case 'Integer':
            return '0';
        case 'Double':
        case 'Number':
            return '0';
        case 'String':
            return '""';
        case 'Boolean':
            return 'False';
        default:
            return 'None';
    }
}
function obTypeToPyType(type) {
    switch (type) {
        case 'Integer':
            return 'int';
        case 'Double':
        case 'Number':
            return 'float';
        case 'String':
            return 'str';
        case 'Boolean':
            return 'bool';
        case null:
            debugger
            return 'NoneType';
        default:
            return type;
    }
}
AST.prototype.toPython = function () {
    throw Error(this.constructor.name + ('没有实现toPython方法'));
};
Dummy.prototype.toPython = function () {
};
ModuleDef.prototype.toPython = function (ctx) {
    ctx.module = this;
    let header = template.buildContent('TEMPLATE_MODULE_HEADER', { MODULE: ctx.module.name });
    ctx.addCode(header);
    this.structs.forEach(st => {
        st.toPython(structsInfo);
    });
    this.fsms.forEach(fsm => {
        fsm.toPython(ctx);
    });
    // this.functions.forEach(f => {
    //     let fullname = f.fullname;
    //     if (ctx.export.functions[f.name]) {
    //         ctx.markError(f.blockId, ctx, '重名函数' + f.name);
    //     }
    //     ctx.export.functions[fullname] = { name: f.name, fullname };
    // });
};
FSMDef.prototype.toPython = function (ctx) {
    if (!this.states || this.states.length == 0) {
        return;
    }
    ctx.fsm = this;
    let header = template.buildContent('TEMPLATE_FSM_HEADER',
        {
            MODULE: ctx.module.name,
            FSMNAME: this.name,
            STATENAME: this.states[0].name
        });
    ctx.addCode(header);
    this.variables.forEach(vari => {
        let vt = template.buildContent('TEMPLATE_FSM_VAR', {
            VAR: vari.name,
            "\"VALUE\"": defaultPythonValueOfOBType(vari.type)
        });
        ctx.addCode(vt);
    });
    let tail = template.buildContent('TEMPLATE_FSM_TAIL',
        {
            MODULE: ctx.module.name,
            FSMNAME: this.name,
            STATENAME: this.states[0].name
        });
    ctx.addCode(tail);
    this.states.forEach(state => {
        state.toPython(ctx);
    });
};
StateDef.prototype.toPython = function (ctx) {
    ctx.state = this;
    let header = template.buildContent('TEMPLATE_STATE_HEADER',
        {
            MODULE: ctx.module.name,
            FSMNAME: ctx.fsm.name,
            STATENAME: this.name
        });
    ctx.addCode(header);
    this.variables.forEach(vari => {
        let vt = template.buildContent('TEMPLATE_STATE_VAR', {
            VAR: vari.name,
            "\"VALUE\"": defaultPythonValueOfOBType(vari.type)
        });
        ctx.addCode(vt);
    });
    let tail = template.buildContent('TEMPLATE_STATE_TAIL',
        {
            MODULE: ctx.module.name,
            FSMNAME: ctx.fsm.name,
            STATENAME: this.name
        });
    ctx.addCode(tail);

    this.eventHandlers.forEach(h => {
        h.toPython(ctx);
    });
    this.messageHandlers.forEach(h => {
        h.toPython(ctx);
    });
};

EventHandlerDef.prototype.toPython = function (ctx) {

    let header = template.buildContent('TEMPLATE_STATE_EVENT_HEADER',
        {
            MODULE: ctx.module.name,
            FSMNAME: ctx.fsm.name,
            STATENAME: ctx.state.name,
            EVENTNAME: this.name,
            ARGTYPE: obTypeToPyType(this.args.length > 0 ? this.args[0].type : null)
        });
    ctx.addCode(header);
    this.body.toPython(ctx);
    let tail = template.buildContent('TEMPLATE_STATE_EVENT_TAIL',
        {
            MODULE: ctx.module.name,
            FSMNAME: ctx.fsm.name,
            STATENAME: ctx.state.name,
            EVENTNAME: this.name,
        });
    ctx.addCode(tail);
};
MessageHandlerDef.prototype.toPython = function (ctx) {

    let header = template.buildContent('TEMPLATE_STATE_MSG_HEADER',
        {
            MODULE: ctx.module.name,
            FSMNAME: ctx.fsm.name,
            STATENAME: ctx.state.name,
            MEGTITLE: this.title,
            ARGTYPE: obTypeToPyType(this.args.length > 0 ? this.args[0].type : null)
        });
    ctx.addCode(header);
    this.body.toPython(ctx);
    let tail = template.buildContent('TEMPLATE_STATE_MSG_TAIL',
        {
            MODULE: ctx.module.name,
            FSMNAME: ctx.fsm.name,
            STATENAME: ctx.state.name,
            MEGTITLE: this.title,
        });
    ctx.addCode(tail);
};
StatementDef.prototype.toPython = function (ctx) {
    this.variables.forEach(v => {
        let vt = template.buildContent('TEMPLATE_LOCAL_VARIABLE', {
            VAR: vari.name,
            "\"VALUE\"": defaultPythonValueOfOBType(vari.type)
        });
        ctx.addCode(vt);
    });
    ctx.Indent++;
    this.instructions.forEach(a => {
        a.toPythonInst(ctx);
    });
    ctx.Indent--;
};
LOG.prototype.toPythonInst = function (ctx) {
    let expr = this.expr.toPythonValue(ctx);
    ctx.addCode(template.buildContent('TEMPLATE_INST_LOG', {
        EXPR: expr
    }));
};
TextConstExpr.prototype.toPythonValue = function (ctx) {
    let v = this.text.replaceAll('"', '\\"')
    return '"' + v + '"';
};
FSMSendMessageWait.prototype.toPythonInst = function (ctx) {
    let TITLE = this.title.toPythonValue(ctx);
    let TARGET = this.targetExpr.toPythonValue(ctx);
    let BODY = this.bodyExpr ? this.bodyExpr.toPythonValue() : 'None';
    let WAIT = this.waitSecond.toPythonValue(ctx);
    let c = template.buildContent('TEMPLATE_INST_FSMSendMessageWait', { TITLE, TARGET, BODY, WAIT });
    ctx.addCode(c);
};
Self.prototype.toPythonValue = function (ctx) {
    return 'self.fsm';
};
IntegerConstExpr.prototype.toPythonValue = function (ctx) {
    return Math.floor(this.number);
};
VoidNativeCall.prototype.toPythonInst = function (ctx) {
    let FUNCCALL = this.func.fullname + '(' + this.args.map(a => a.toPythonValue(ctx)).join(',') + ')';
    let c = template.buildContent('TEMPLATE_INST_FUNCCALL', { FUNCCALL })
    ctx.addCode(c);
};
FloatConstExpr.prototype.toPythonValue = function (ctx) {
    return String(this.number);
};
FSMSendMessage.prototype.toPythonInst = function (ctx) {
    let TITLE = this.title.toPythonValue(ctx);
    let TARGET = this.targetExpr.toPythonValue(ctx);
    let BODY = this.bodyExpr ? this.bodyExpr.toPythonValue() : 'None';
    let c = template.buildContent('TEMPLATE_INST_FSMSendMessage', { TITLE, TARGET, BODY });
    ctx.addCode(c);
}
EnvRef.prototype.toPythonValue = function (ctx) {
    return this.value;
};