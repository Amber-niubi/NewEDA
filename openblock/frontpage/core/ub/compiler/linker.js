/**
 * @license
 * Copyright 2021 Du Tian Wei
 * SPDX-License-Identifier: Apache-2.0
 */

class Linker {
    static worker;
    linked;
    onFinisheds = [];
    link(compiledLibs, data, env, cb) {
        this.stop();
        Linker.worker = new WorkerContext(OpenBlock.safePath + 'compiler/linkerWorker.js');
        let data1 = { compiled: data.compiled };
        data1.structAST = JSON.parse(JSON.stringify(data.structAST));

        let entryFSMName = env.entry;
        Linker.worker.postMessage({ compiledLibs, data: data1, nativeFuncMap: env ? env.nativefunctions : {}, entryFSMName }, (e, r) => {
            if (!e) {
                OpenBlock.Linker.linked = r;
            }
            for (let i = 0; i < this.onFinisheds.length; i++) {
                let f = this.onFinisheds[i];
                try {
                    f(e, r);
                } catch (e) {
                    console.error(e);
                }
            }
            if (cb) {
                cb(e, r);
            }
            // Linker.worker.terminate();
        });
    }
    onFinished(f) {
        this.onFinisheds.push(f);
    }
    stop() {
        if (Linker.worker) {
            Linker.worker.terminate();
        }
    }
}
OpenBlock.Linker = new Linker();