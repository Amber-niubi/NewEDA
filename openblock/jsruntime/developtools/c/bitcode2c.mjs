import { toASCII, nameToASCII } from './utils.mjs'

let bitcodeToC;

function reg(_reg, ctx) {
    if (_reg) {
        // return `${_reg.rtype}Reg[${_reg.i}]`;
        return ctx.registers[_reg.rtype][_reg.i];
    } else {
        return "NULL";
    }
}

function messageArgType(reg) {
    switch (reg.rtype) {
        case 'float':
            return 'number';
        case 'integer':
            return 'integer';
        default:
            return 'ptrdiff';
    }
}
function ValueType(reg) {
    if (reg.astType) {
        return reg.astType;
    }
    switch (reg.rtype) {
        case 'float':
            return 'Number';
        case 'integer':
            return 'Integer';
        case 'string':
            return 'String';
        case 'Nobject':
            return reg.astType;
        default:
            debugger
            throw Error('不支持的类型:' + ret.type);
    }
}
function setReg(_reg, ctx, value) {
    if (_reg) {
        ctx.registers[_reg.rtype][_reg.i] = '(' + value + ')';
    }
}
function regTypeByCode(regCode) {
    let type = regCode >> 12;
    switch (type) {
        case 0:
            type = 'integer';
            break;
        case 1:
            type = 'float';
            break;
        case 2:
            type = 'string';
            break;
        case 3:
            type = 'object';
            break;
        case 4:
            type = 'Nobject';
            break;
    }
    return type;
}
function regByCode(_reg, ctx) {
    let type = regTypeByCode(_reg);
    let idx = _reg & 0xfff;
    return ctx.registers[type][idx];
}
function setRegByCode(_reg, ctx, value) {
    let type = regTypeByCode(_reg);
    let idx = _reg & 0xfff;
    ctx.registers[type][idx] = value
}
function vari(_reg) {
    return `${_reg.rtype}Var[${_reg.i}]`;
}
function toNativeType(regType, value) {
    if (regType == ("string")) {
        return `ptr2str(vm,${value})->content`;
    } else {
        return value;
    }
}
let preprocess = {
    // getStr(str, args, ncall) {
    //     return `getStrPtr(vm,${parseInt(args[0]) + 1},${ncall.args.length},${str})`;
    // }
}
bitcodeToC = {
    B_CreateFSM(code, ctx) {
        setReg(code.ReturnRegister, ctx, `(void*)OB_FSM_${toASCII(code.FSMTypeNameIdx.str)}_create(vm,fsm,state,fn)`);
    },
    B_Reg2Var(code, ctx) {
        return `${vari(code.vari)} = ${reg(code.reg, ctx)};`;
    },
    B_LDI(code, ctx) {
        setReg(code.register, ctx, `${code.number.value}`);
    },
    B_ExtInfo(code, ctx) {
        return;
    },
    B_ValueNativeCall(code, ctx, bitcodes, idx) {

        let c = code.ast.func.name;
        let ext = bitcodes[idx - 1];
        let returnReg = ext.info.value[2];
        let pp = c.split('#');
        if (pp.length > 1) {
            c = pp.shift();
            pp.forEach(p => {
                let sp = p.split('(');
                let args = null;
                if (sp.length > 1) {
                    p = sp[0];
                    let arglst = sp[1].substring(0, sp[1].length - 1);
                    args = arglst.split(',');
                }
                c = preprocess[p](c, args, code.ast);
            });
        }
        if (c.endsWith(')')) {
            if (code.ast.args.length > 0) {
                throw Error({ message: '固定调用不能设置参数', ast: code.ast });
            }
        } else {
            let args = [];
            for (let i = 3; i < ext.info.value.length; i++) {
                args.push(toNativeType(regTypeByCode(ext.info.value[i]), regByCode(ext.info.value[i], ctx)));
            }
            c += '(' + args.join(', ') + ')';
        }
        if (returnReg != -1) {
            setRegByCode(returnReg, ctx, c);
        } else {
            return c + ';'
        }
    },
    B_LDSTR(code, ctx) {
        let str = code.str.str.split('\n').join('\\n');
        setReg(code.register, ctx, `str2ptr(vm,"${str}",NULL)`);
    },
    B_TextJoin(code, ctx) {
        setReg(code.retReg, ctx, `stringjoin(vm,${reg(code.left, ctx)},${reg(code.right, ctx)})`);
    },
    B_LDF(code, ctx) {
        let value = code.number.value;
        value = String(value);
        if (value.indexOf('.') < 0) {
            value = value + '.0';
        }
        setReg(code.register, ctx, `${value}`);
    },
    B_RAND(code, ctx) {
        setReg(code.retReg, ctx, `((double)ob_rand())/((double)RAND_MAX)`);
    },
    B_I2F(code, ctx) {
        setReg(code.floatReg, ctx, `(double)${reg(code.intReg, ctx)}`);
    },
    B_F2I(code, ctx) {
        setReg(code.intReg, ctx, `(long)${reg(code.floatReg, ctx)}`);
    },
    B_ARITHI(code, ctx) {
        return bitcodeToC.B_ARITHF(code, ctx);
    },
    B_ARITHF(code, ctx) {
        let op;
        switch (code.opcode) {
            case 0:
                op = ' + ';
                break;
            case 1:
                op = ' - ';
                break;
            case 2:
                op = ' * ';
                break;
            case 3:
                op = ' / ';
                break;
            case 4:
                setReg(code.left, ctx, `pow(${reg(code.left, ctx)},${reg(code.right, ctx)})`);
            case 5:
                op = ' % ';
                break;
            case 6:
                setReg(code.left, ctx, `atan2(${reg(code.left, ctx)},${reg(code.right, ctx)})`);
        }
        // return c + reg(code.left) + op + reg(code.right) + ';';
        setReg(code.left, ctx, reg(code.left, ctx) + op + reg(code.right, ctx));
    },
    B_Var2Reg(code, ctx) {
        setReg(code.reg, ctx, `${vari(code.vari)}`);
    },
    B_GZ0(code, ctx) {
        setReg(code.resultReg, ctx, `${reg(code.valueReg, ctx)} > 0`);
    },
    B_LT(code, ctx) {
        setReg(code.ret, ctx, `${reg(code.left, ctx)} < ${reg(code.right, ctx)}`);
    },
    B_EQ(code, ctx) {
        setReg(code.ret, ctx, `${reg(code.left, ctx)} == ${reg(code.right, ctx)}`);
    },
    B_NEQ(code, ctx) {
        setReg(code.ret, ctx, `${reg(code.left, ctx)} != ${reg(code.right, ctx)}`);
    },
    B_LTE(code, ctx) {
        setReg(code.ret, ctx, `${reg(code.left, ctx)} <= ${reg(code.right, ctx)}`);
    },
    B_GT(code, ctx) {
        setReg(code.ret, ctx, `${reg(code.left, ctx)} > ${reg(code.right, ctx)}`);
    },
    B_GTE(code, ctx) {
        setReg(code.ret, ctx, `${reg(code.left, ctx)} >= ${reg(code.right, ctx)}`);
    },
    B_BRIFN(code, ctx, bitcodes, idx, from) {
        return `if(${reg(code.checkReg, ctx)}==0){goto pos${code.targetOffset - from};}`;
    },
    B_NOP(code, ctx) {
        return ';';
    },
    B_DEC(code, ctx) {
        setReg(code.register, ctx, `${reg(code.register, ctx)} - 1`);
    },
    B_BR(code, ctx, bc, idx, from) {
        return `goto pos${code.targetOffset - from};`;
    },
    B_PRT(code, ctx) {
        let argRegister = code.argRegister;
        let args;
        switch (argRegister.rtype) {
            case 'integer':
                args = `"%ld",${reg(argRegister, ctx)}`;
                break;
            case 'float':
                args = `"%lf",${reg(argRegister, ctx)}`;
                break;
            case 'string':
                args = `"%s",ptr2str(vm,${reg(argRegister, ctx)})->content`;
                break;
            case 'object':
                args = `"%s","object"`;
                break;
            case 'Nobject':
                args = `"%ld","Nobject"`;
                break;
        }
        // return `if(GetOBVMConfig(vm)->output!=NULL){fprintf(GetOBVMConfig(vm)->output,${args});}else{printf(${args});}`;
        return `printf(${args});`;
    },
    B_CHSTT(code, ctx) {
        return [
            'do{',
            '  OB_unlink_obj(vm,fsm,offsetof(OB_FSM,currentState),GetOBFSM(vm,fsm)->currentState);',
            `  STATE_PTR cst = OB_STATE_${nameToASCII(ctx.module.name, ctx.fsm.name, code.ast.targetStateName)}_create(vm, fsm);`,
            "  GetOBFSM(vm,fsm)->currentState = cst;",
            '  OB_link_obj(vm,fsm,offsetof(OB_FSM,currentState),GetOBFSM(vm,fsm)->currentState);',
            '  OB_FSM_STATE_start(vm,fsm);',
            `  return ChangeStateException;`,
            '}while(0);'
        ]
    },
    B_SLF(code, ctx) {
        setReg(code.retReg, ctx, `fsm`);
    },
    B_ToString(code, ctx) {
        // let c = `${reg(code.retReg, ctx)} = `;
        let c = '';
        switch (code.input.rtype) {
            case 'integer':
                c += `longToStrPtr(vm,${reg(code.input, ctx)})`;
                break;
            case 'float':
                c += `doubleToStrPtr(vm,${reg(code.input, ctx)})`;
                break;
            case 'string':
                c += reg(code.input, ctx);
                break;
            case 'object':
            case 'Nobject':
                c += `OB_toString(vm,${reg(code.input, ctx)})`;
                break;
        }
        // return c + ';';
        setReg(code.retReg, ctx, c);
    },
    B_FSMVS(code, ctx) {
        return `((/* ${ctx.module.name}.${ctx.fsm.name} */ OB_FSM_${nameToASCII(ctx.module.name, ctx.fsm.name)}*)GetOBFSM(vm,fsm))->${nameToASCII(code.ast.name)} = ${reg(code.valueReg, ctx)};`;
    },
    B_FSMVG(code, ctx) {
        setReg(code.valueReg, ctx, `((/* ${ctx.module.name}.${ctx.fsm.name} */ OB_FSM_${nameToASCII(ctx.module.name, ctx.fsm.name)}*)GetOBFSM(vm,fsm))->${nameToASCII(code.ast.name)}`);
    },
    B_ValueMethodCall(code, ctx, bc, idx) {
        let ext = bc[idx - 1];
        let returnReg = ext.info.value[1];
        let funcName = code.ast.MethodName;
        funcName = funcName.substring(0, funcName.indexOf('('));
        funcName = nameToASCII.apply(null, funcName.split('.'));
        let args = "";

        for (let i = 2; i < ext.info.value.length; i++) {
            args += `,${regByCode(ext.info.value[i], ctx)}`;
        }
        if (code.ast.MethodName.endsWith(')v')) {
            return `OB_FUNC_${funcName}(vm,fsm,state ${args});`;
        } else if (returnReg) {
            setRegByCode(returnReg, ctx, `OB_FUNC_${funcName}(vm,fsm,state ${args})`);
            return;
        } else {
            return `OB_FUNC_${funcName}(vm,fsm,state ${args});`;
        }
    },
    B_RET(code, ctx) {
        return `return ${reg(code.retReg, ctx)};`;
    },
    B_FSMSendMsg(code, ctx) {
        if (code.bodyExpr) {
            return [
                "do{",
                `  OB_Message* msg1 = OB_malloc(vm, OB_Message, "OB_Message",NULL);`,
                `  msg1->share = 0;`,
                `  msg1->name = "${code.ast.title.text}";`,
                `  msg1->type = OB_Message_Type_USERMSG;`,
                `  msg1->arg.${messageArgType(code.bodyExpr)} = ${reg(code.bodyExpr, ctx)};`,
                `  msg1->argType = "${ValueType(code.bodyExpr)}";`,
                `  MSG_PTR msg = GetOBPtr(vm, msg1);`,
                `  OB_FSM_post_message(vm,${reg(code.target, ctx)},msg);`,
                "}while(0);"
            ];
        } else {
            return [
                "do{",
                `  OB_Message* msg1 = OB_malloc(vm, OB_Message, "OB_Message",NULL);`,
                `  msg1->share = 0;`,
                `  msg1->name = "${code.ast.title.text}";`,
                `  msg1->type = OB_Message_Type_USERMSG;`,
                `  MSG_PTR msg = GetOBPtr(vm, msg1);`,
                `  OB_FSM_post_message(vm,${reg(code.target, ctx)},msg);`,
                "}while(0);"];
        }
    },
    B_FSMSendMsgWait_Data(code) {
        // 此命令为字节码指令，生成C语言时在B_FSMSendMsgWait中处理
    },
    B_FSMSendMsgWait(code, ctx, bc, idx) {
        let data = bc[idx - 1];
        // let target = reg(data.target, ctx);
        let waitMilliSecond = reg(code.waitSecond, ctx);
        if (code.bodyExpr) {
            return [
                "do{",
                `  OB_Message* msg1 = OB_malloc(vm, OB_Message, "OB_Message",NULL);`,
                `  msg1->share = 0;`,
                `  msg1->name = "${code.ast.title.text}";`,
                `  msg1->type = OB_Message_Type_USERMSG;`,
                `  msg1->arg.${messageArgType(code.bodyExpr)} = ${reg(code.bodyExpr, ctx)};`,
                `  msg1->argType = "${ValueType(code.bodyExpr)}";`,
                `  MSG_PTR msg = GetOBPtr(vm, msg1);`,
                `  OB_Scheduled_MSG(vm,${waitMilliSecond},${reg(data.target, ctx)},msg,-1);`,
                "}while(0);"
            ];
        } else {

            return [
                "do{",
                `  OB_Message* msg1 = OB_malloc(vm, OB_Message, "OB_Message",NULL);`,
                `  msg1->share = 0;`,
                `  msg1->name = "${code.ast.title.text}";`,
                `  msg1->type = OB_Message_Type_USERMSG;`,
                `  MSG_PTR msg = GetOBPtr(vm, msg1);`,
                `  OB_Scheduled_MSG(vm,${waitMilliSecond},${reg(data.target, ctx)},msg,-1);`,
                "}while(0);"];
        }
    },
    B_FSMBroadcastMsg(code, ctx) {
        if (code.bodyExpr) {
            return [
                "do{",
                `  OB_Message* msg1 = OB_malloc(vm, OB_Message, "OB_Message",NULL);`,
                `  msg1->share = 0;`,
                `  msg1->name = "${code.ast.title.text}";`,
                `  msg1->type = OB_Message_Type_USERMSG;`,
                `  msg1->arg.${messageArgType(code.bodyExpr)} = ${reg(code.bodyExpr, ctx)};`,
                `  msg1->argType = "${ValueType(code.bodyExpr)}";`,
                `  MSG_PTR msg = GetOBPtr(vm, msg1);`,
                `  OB_BroadcastMsg(vm,msg,${code.sendToSelf == 0 ? 'fsm' : '-1'});`,
                "}while(0);"
            ];
        } else {
            return [
                "do{",
                `  OB_Message* msg1 = OB_malloc(vm, OB_Message, "OB_Message",NULL);`,
                `  msg1->share = 0;`,
                `  msg1->name = "${code.ast.title.text}";`,
                `  msg1->type = OB_Message_Type_USERMSG;`,
                `  MSG_PTR msg = GetOBPtr(vm, msg1);`,
                `  OB_BroadcastMsg(vm,msg,${code.sendToSelf == 0 ? 'fsm' : '-1'});`,
                "}while(0);"];
        }
    },
    B_FSMBroadcastMsgWait(code, ctx) {
        let waitMilliSecond = reg(code.waitSecond, ctx);
        if (code.bodyExpr) {
            return [
                "do{",
                `  OB_Message* msg1 = OB_malloc(vm, OB_Message, "OB_Message",NULL);`,
                `  msg1->share = 0;`,
                `  msg1->name = "${code.ast.title.text}";`,
                `  msg1->type = OB_Message_Type_USERMSG;`,
                `  msg1->arg.${messageArgType(code.bodyExpr)} = ${reg(code.bodyExpr, ctx)};`,
                `  msg1->argType = "${ValueType(code.bodyExpr)}";`,
                `  MSG_PTR msg = GetOBPtr(vm, msg1);`,
                `  OB_Scheduled_MSG(vm,${waitMilliSecond},-1,msg,${code.sendToSelf == 0 ? 'fsm' : '-1'});`,
                "}while(0);"
            ];
        } else {

            return [
                "do{",
                `  OB_Message* msg1 = OB_malloc(vm, OB_Message, "OB_Message",NULL);`,
                `  msg1->share = 0;`,
                `  msg1->name = "${code.ast.title.text}";`,
                `  msg1->type = OB_Message_Type_USERMSG;`,
                `  MSG_PTR msg = GetOBPtr(vm, msg1);`,
                `  OB_Scheduled_MSG(vm,${waitMilliSecond},-1,msg,${code.sendToSelf == 0 ? 'fsm' : '-1'});`,
                "}while(0);"];
        }
    },
    B_STVS(code, ctx) {
        return `((/* ${ctx.module.name}.${ctx.fsm.name}.${ctx.state.name}.${code.ast.name} */ OB_STATE_${nameToASCII(ctx.module.name, ctx.fsm.name, ctx.state.name)}*)GetOBSTATE(vm,state))->${nameToASCII(code.ast.name)} = ${reg(code.valueReg, ctx)};`;
    },
    B_STVG(code, ctx) {
        setReg(code.valueReg, ctx, `((/* ${ctx.module.name}.${ctx.fsm.name}.${ctx.state.name}.${code.ast.name} */ OB_STATE_${nameToASCII(ctx.module.name, ctx.fsm.name, ctx.state.name)}*)GetOBSTATE(vm,state))->${nameToASCII(code.ast.name)}`);
    },
    B_LNOT(code, ctx) {
        setReg(code.a, ctx, `!${reg(code.a, ctx)}`);
    },
    B_ReceivedMsg(code, ctx) {
        setReg(code.register, ctx, `GetOBMessageArg(vm,msg).${messageArgType(code.register)}`);
    },
    B_DFSM(code, ctx) {
        return `OB_FSM_destroy(vm,fsm,state,fn);`;
    },
    B_SGLF(code, ctx) {
        switch (code.opcode) {
            case 0:
                // builder.DoubleRegister(value, (s, f, l) => {
                //     return -f_value(s, f, l);
                // });
                setReg(code.value, ctx, `(-${reg(code.value, ctx)})`);
                break;
            case 1:
                // builder.DoubleRegister(value, (s, f, l) => {
                //     return Math.log(f_value(s, f, l));
                // });
                setReg(code.value, ctx, `log(${reg(code.value, ctx)})`);
                break;
            case 2:
                // builder.DoubleRegister(value, (s, f, l) => {
                //     return Math.log10(f_value(s, f, l));
                // });
                setReg(code.value, ctx, `log10(${reg(code.value, ctx)})`);
                break;
            case 3:
                // builder.DoubleRegister(value, (s, f, l) => {
                //     return Math.exp(f_value(s, f, l));
                // });
                setReg(code.value, ctx, `exp(${reg(code.value, ctx)})`);
                break;
            case 4:
                // builder.DoubleRegister(value, (s, f, l) => {
                //     return Math.pow(10, f_value(s, f, l));
                // });
                setReg(code.value, ctx, `pow(10,${reg(code.value, ctx)})`);
                break;
            case 5:
                // builder.DoubleRegister(value, (s, f, l) => {
                //     return Math.sqrt(f_value(s, f, l));
                // });
                setReg(code.value, ctx, `sqrt(${reg(code.value, ctx)})`);
                break;
            case 6:
                // builder.DoubleRegister(value, (s, f, l) => {
                //     return Math.abs(f_value(s, f, l));
                // });
                setReg(code.value, ctx, `abs(${reg(code.value, ctx)})`);
                break;
            case 7:
                // builder.DoubleRegister(value, (s, f, l) => {
                //     return Math.sin(f_value(s, f, l));
                // });
                setReg(code.value, ctx, `sin(${reg(code.value, ctx)})`);
                break;
            case 8:
                // builder.DoubleRegister(value, (s, f, l) => {
                //     return Math.cos(f_value(s, f, l));
                // });
                setReg(code.value, ctx, `cos(${reg(code.value, ctx)})`);
                break;
            case 9:
                // builder.DoubleRegister(value, (s, f, l) => {
                //     return Math.tan(f_value(s, f, l));
                // });
                setReg(code.value, ctx, `tan(${reg(code.value, ctx)})`);
                break;
            case 10:
                // builder.DoubleRegister(value, (s, f, l) => {
                //     return Math.asin(f_value(s, f, l));
                // });
                setReg(code.value, ctx, `asin(${reg(code.value, ctx)})`);
                break;
            case 11:
                // builder.DoubleRegister(value, (s, f, l) => {
                //     return Math.acos(f_value(s, f, l));
                // });
                setReg(code.value, ctx, `acos(${reg(code.value, ctx)})`);
                break;
            case 12:
                // builder.DoubleRegister(value, (s, f, l) => {
                //     return Math.atan(f_value(s, f, l));
                // });
                setReg(code.value, ctx, `atan(${reg(code.value, ctx)})`);
                break;
            case 13:
                // builder.DoubleRegister(value, (s, f, l) => {
                //     return Math.round(f_value(s, f, l));
                // });
                setReg(code.value, ctx, `round(${reg(code.value, ctx)})`);
                break;
            case 14:
                // builder.DoubleRegister(value, (s, f, l) => {
                //     return Math.ceil(f_value(s, f, l));
                // });
                setReg(code.value, ctx, `ceil(${reg(code.value, ctx)})`);
                break;
            case 15:
                // builder.DoubleRegister(value, (s, f, l) => {
                //     return Math.floor(f_value(s, f, l));
                // });
                setReg(code.value, ctx, `floor(${reg(code.value, ctx)})`);
        }
    },
    B_Sender(code, ctx) {
        debugger
    },
    B_SHL(code, ctx) {
        setReg(code.a, ctx, `(${reg(code.a, ctx)} << ${reg(code.b, ctx)})`);
    },
    B_AND(code, ctx) {
        setReg(code.a, ctx, `(${reg(code.a, ctx)} & ${reg(code.b, ctx)})`);
    },
    B_FIX(code, ctx) {
        debugger
    },
    B_LAND(code, ctx) {
        setReg(code.a, ctx, `(${reg(code.a, ctx)} && ${reg(code.b, ctx)})`);
    },
    B_LOR(code, ctx) {
        setReg(code.a, ctx, `(${reg(code.a, ctx)} || ${reg(code.b, ctx)})`);
    },
    B_COND(code, ctx) {
        debugger
    },
    B_NEW(code, ctx) {
        debugger
    },
    B_CSTR(code, ctx) {
        debugger
    },
    B_PUSTT(code, ctx) {
        debugger
    },
    B_POPSTT(code, ctx) {
        debugger
    },
    B_ENVREF(code, ctx) {
        debugger
    },
    B_GetStructField(code, ctx) {
        debugger
    },
    B_SetStructField(code, ctx) {
        debugger
    },
    B_Struct_Field_Desc(code, ctx) {
        debugger
    },
    B_VOM(code, ctx) {
        debugger
    },
    B_LIST(code, ctx) {
        debugger
    },
    B_SMAP(code, ctx) {
        debugger
    },
    B_IMAP(code, ctx) {
        debugger
    },
    B_STKV(code, ctx) {
        debugger
    },
    B_RKOM(code, ctx) {
        debugger
    },
    B_SOM(code, ctx) {
        debugger
    },
    B_VOIM(code, ctx) {
        debugger
    },
    B_STIKV(code, ctx) {
        debugger
    },
    B_RKOIM(code, ctx) {
        debugger
    },
    B_VAT(code, ctx) {
        debugger
    },
    B_SVAT(code, ctx) {
        debugger
    },
    B_IVAT(code, ctx) {
        debugger
    },
    B_RVAT(code, ctx) {
        debugger
    },
    B_VAD(code, ctx) {
        debugger
    },
    B_DBI(code, ctx) {
        debugger
    },
    B_DBE(code, ctx) {
        debugger
    },
    B_SME(code, ctx) {
        debugger
    },
    B_IME(code, ctx) {
        debugger
    },
    B_IMA(code, ctx) {
        debugger
    },
    B_SMA(code, ctx) {
        debugger
    },
    B_CLONE(code, ctx) {
        debugger
    },
    B_FSMSendMessageIntervalToSelf(code, ctx) {
        debugger
    },
};
export default bitcodeToC;