
import * as obvm from './vm.mjs'
class TextLib {
    install(script) {
        script.InstallLib("text", "text", [
            script.NativeUtil.closureReturnValue(
                (radix, value) => {
                    return value.toString(radix);
                },
                'StringRegister', ['LongRegister', 'DoubleRegister'], false
            ),
            script.NativeUtil.closureReturnValue(
                (name, st) => {
                    return st.fsm.VM.assets[name] || '';
                },
                'StringRegister', ['StringRegister'], true
            ),
            script.NativeUtil.closureReturnValue(
                (separator, string) => {
                    let list = string.split(separator);
                    let lst = new obvm.OBList(list);
                    return lst;
                },
                'StructRegister', ['StringRegister', 'StringRegister'], true
            ),
        ]);
    }
}

export default TextLib;