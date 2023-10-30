
import * as obvm from './vm.mjs'
class CodePointLib {
    install(script) {
        script.InstallLib("codePoint", "codePoint", [
            script.NativeUtil.closureReturnValue(
                (s, i) => {
                    return s.codePointAt(i) || 0;
                },
                'LongRegister', ['StringRegister', 'LongRegister'], false
            ),
            script.NativeUtil.closureReturnValue(
                (i) => {
                    return String.fromCodePoint(i);
                },
                'StringRegister', ['LongRegister'], false
            ),
            script.NativeUtil.closureReturnValue(
                (list) => {
                    return String.fromCodePoint.apply(null, list.c);
                },
                'StringRegister', ['StructRegister'], false
            ),
            script.NativeUtil.closureReturnValue(
                (str) => {
                    let list = [];
                    for (let i = 0; i < str.length; i++) {
                        list[i] = str.codePointAt(i);
                    }
                    let lst = new obvm.OBList(list);
                    return lst;
                },
                'StructRegister', ['StringRegister'], false
            ),
        ]);
    }
}

export default CodePointLib;