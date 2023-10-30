
export function toASCII(str) {
    return 'v' + str.split('').map(c => c.charCodeAt(0)).join('').replaceAll('=', '').replaceAll('+', 'A').replaceAll('-', 'B');
}

export function nameToASCII() {
    let args = [];
    for (let i = 0; i < arguments.length; i++) {
        if (typeof (arguments[i]) == 'string') {
            args.push(arguments[i]);
        } else {
            break;
        }
    }
    let t = args.join('.');
    let a = toASCII(t);
    return a;
}
export function lengthUTF8(str) {
    var i = 0, code, len = 0;
    for (; i < str.length; i++) {
        code = str.charCodeAt(i);
        if (code == 10) {//回车换行问题
            len += 2;
        } else if (code < 0x007f) {
            len += 1;
        } else if (code >= 0x0080 && code <= 0x07ff) {
            len += 2;
        } else if (code >= 0x0800 && code <= 0xffff) {
            len += 3;
        }
    }
    return len;
}