class OBOP {
    srcs = [];
    constructor() {
    }
}
let p = new OBOP();
OpenBlock.onInited(() => {
    p.srcs = OpenBlock.BlocklyParser.loadedFiles.srcs;
    OpenBlock.VFS.partition.src.on('changed', () => {
        p.srcs = OpenBlock.BlocklyParser.loadedFiles.srcs;
    });
});
function fontColor(r, g, b) {
    if (r + g + b > 430) {
        return 'black';
    } else {
        return 'white';
    }
}
export default {
    install(app, options) {
        // 注入一个全局可用的 i() 方法
        app.config.globalProperties.openblock = p;
        app.config.globalProperties.$toFontColor = function (color) {
            if (typeof (color) === 'string' && color.startsWith('#')) {
                let l = color.length;
                if (l == 7 || l == 9) {
                    let r = parseInt(color.substring(1, 3), 16);
                    let g = parseInt(color.substring(3, 5), 16);
                    let b = parseInt(color.substring(5, 7), 16);
                    return fontColor(r, g, b);
                } else if (l = 4 || l == 5) {
                    let r = parseInt(color.substring(1, 1), 16) * 17;
                    let g = parseInt(color.substring(2, 2), 16) * 17;
                    let b = parseInt(color.substring(3, 3), 16) * 17;
                    return fontColor(r, g, b);
                }
            } else {
                throw Error('not support yet.');
            }
        };
    }
}