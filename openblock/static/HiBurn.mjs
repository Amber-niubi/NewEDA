/**
 * @license
 * Copyright 2021 Du Tian Wei
 * SPDX-License-Identifier: Apache-2.0
 */
let agentPort = 30308;
const agent = 'https://openblock.localhost.lionscript.online';
import { defineAsyncComponent } from 'vue';
let portlist = defineAsyncComponent(() => {
    return new Promise((resolve) => {
        axios.get('../static/portlist.html').then(({ data }) => {
            resolve({
                props: ['data', 'modal'],
                data() {
                    return {
                        portlist: null,
                        showNotice: false,
                        shown: true
                    }
                },
                methods: {
                    async select(port) {
                        if (port.sending) {
                            return;
                        }
                        port.sending = true;
                        try {
                            await this.data.resolve(port.path);
                            OB_IDE.$Notice.success({
                                title: OpenBlock.i('根据提示在适当时机重置开发板。'),
                                desc: port.friendlyName
                            });
                            await OpenBlock.Utils.delay(1500);
                        } finally {
                            port.sending = false;
                        }
                        // this.modal.close();
                    },
                    cancel() {
                        this.modal.close();
                        // this.data.resolve();
                    },
                    async update() {
                        let res;
                        while (this.shown) {
                            L1: for (let j = 0; j < 2; j++) {
                                for (let i = 30308; i <= 30318; i++) {
                                    try {
                                        res = await axios({ url: `${agent}:${i}/portlist`, responseType: 'json' });
                                        this.showNotice = false;
                                        agentPort = i;
                                        break L1;
                                    } catch (e) {
                                        this.showNotice = true;
                                    }
                                }
                            }
                            if (res) {
                                if (!this.portlist) {
                                    res.data.forEach(d => { d.sending = false; });
                                    this.portlist = res.data;
                                } else {
                                    res.data.forEach(newPort => {
                                        let oldPort = this.portlist.find(p => p.path == newPort.path);
                                        if (!oldPort) {
                                            this.portlist.push(newPort);
                                        }
                                    });
                                    for (let i = this.portlist.length - 1; i >= 0; i--) {
                                        let oldPort = this.portlist[i];
                                        let newPort = res.data.find(p => p.path == oldPort.path);
                                        if (!newPort) {
                                            this.portlist.splice(i, 1);
                                        }
                                    }
                                }
                            }
                            await OpenBlock.Utils.delay(1500);
                        }
                    }
                },
                async mounted() {
                    this.update();
                },
                unmounted() {
                    this.shown = false;
                },
                template: data
            });
        });
    });
});
export default class HiBurn {
    reader;
    writer;
    buf = [];
    constructor(opt) {
        this.opt = opt;
    }
    async runBurn(file, port, opt) {
        OB_IDE.$Notice.success({
            title: OpenBlock.i('准备烧录'),
            desc: port
        });
        async function postAgent(port) {
            (await axios.post(`${agent}:${agentPort}/tools/${opt.tool}/${port}`, file)).data;
        }
        try {
            await postAgent(port);
        } catch (e) {
            console.error(e);
        }
    }
    async burn(file, opt) {
        let that = this;
        OB_IDE.openModal({
            closable: false,
            maskClosable: false,
            title: OpenBlock.i('选择端口'),
            component: portlist,
            componentOptions: {
                async resolve(port) { await that.runBurn(file, port, opt) }
            }
        });
    }
}