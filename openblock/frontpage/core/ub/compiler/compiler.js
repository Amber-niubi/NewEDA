/**
 * @license
 * Copyright 2021 Du Tian Wei
 * SPDX-License-Identifier: Apache-2.0
 */

class Compiler {
    static workers = [];
    compiled = {};
    compile(ast, options, cb) {
        let worker = new WorkerContext(OpenBlock.safePath + 'compiler/compilerWorker.js');
        Compiler.workers.push(worker);
        let envNames = options.env;
        let nativeTypes = OpenBlock.Env.getNativeTypes(envNames);
        worker.postMessage({ str_ast: JSON.stringify(ast), nativeTypes, options }, function (e, r, worker) {
            if (!e) {
                r.analysed = JSON.parse(r.analysed, Deserializer);
                r.export = JSON.parse(r.export, Deserializer);
                // r.bitcode = JSON.parse(r.bitcode);
                OpenBlock.Compiler.compiled[ast.name] = r;
            }
            if (cb) {
                cb(e, r);
            }
        });
    }
    stop() {
        let workers = Compiler.workers;
        Compiler.workers = []
        workers.forEach(w => w.terminate());
    }
};

OpenBlock.Compiler = new Compiler();