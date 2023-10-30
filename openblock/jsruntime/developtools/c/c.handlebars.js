
module.exports = {
    base64(str) {
        return str.split('').map(c => c.charCodeAt(0)).join('').replaceAll('=', '').replaceAll('+', 'A').replaceAll('-', 'B');
    },
    argtype(args){
        return args.join('_');
    }
};