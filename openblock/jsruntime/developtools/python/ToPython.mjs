/**
 * @license
 * Copyright 2021 Du Tian Wei
 * SPDX-License-Identifier: Apache-2.0
 */
import Template from "../template.mjs";

export default class ToPython {
    // static library;
    static template;
    /**
     * 
     * @param {Object} options {pyVersion:'3.0'}
     * @returns String
     */
    static async buildLogicSrc(options) {
        let c = await ToPython.genCode(options);
        return c;
    }
    static async genCode(options) {
        // 为了验证语法、关联，必须走一遍打包，但是返回值可忽略
        let _ = await OpenBlock.exportExePackage(options);
        let template = ToPython.template;
        if (options.envTemplate) {
            Object.assign(template.template, options.envTemplate.template);
        }
        let srcs = OpenBlock.BlocklyParser.loadedFiles.srcs
            .filter(s => options.srcList.indexOf(s.name) >= 0);
        let importLib = {};
        srcs.map((src, i, a) => {
            src.__compiled.nativeLibs.forEach(lib => {
                importLib[lib.libname] = true;
            });
        });
        importLib = Object.keys(importLib);
        let importCode = importLib.map(LIBNAME => {
            let code = template.buildContent('TEMPLATE_IMPORT', { LIBNAME });
            return code;
        }).join('');

        let code = await Promise.all(srcs.map(s => ToPython.genModuleCode(s, template)));
        let all = template.buildContent('TEMPLATE_HEADER') + importCode + template.buildContent('TEMPLATE_LIBRARY') + code.join('\n');
        let initCode = template.buildContent('TEMPLATE_INIT');
        all += initCode;
        if (options.entry) {
            let entry = options.entry.replaceAll('.', '_');
            all += template.buildContent('TEMPLATE_RUN', { MODULE_FSMNAME: entry });
        }
        return all;
    }
    static async genModuleCode(src, template) {
        let p = new Promise((resolve, reject) => {
            var toPyWorker = new Worker('../jsruntime/developtools/python/AST2PythonWorker.mjs');
            toPyWorker.postMessage(JSON.stringify({ ast: src.__analyzed, template }));
            toPyWorker.onmessage = (evt) => {
                let data = evt.data;
                if (data.result == 'success') {
                    resolve(evt.data.code);
                } else {
                    reject(evt.data.error);
                }
            };
        });
        return p;
    }
}

axios({
    url: '../jsruntime/developtools/python/basetemplate.py',
    responseType: 'text'
}).then(({ data }) => {
    ToPython.template = Template.parseTemplate(data, '#');
});