

import { defineAsyncComponent, toRaw, nextTick } from 'vue';
let IframePreviewer = defineAsyncComponent(() => {
    return new Promise((resolve, reject) => {
        axios('../iframeconnector/IframePreviewer.html').then(({ data }) => {
            resolve({
                name: 'IframePreviewer',
                props: [],
                template: data,
                data() {
                    return {
                        components: [],
                        modal: true,
                        manager: null,
                        scene: null,
                        bytes: null,
                        title: '',
                        id: 0,
                        url: null,
                        mousePosition: { x: 0, y: 0 },
                        style: {
                            width: '375px',
                            height: '600px',
                            widthWithDev: '900px',
                            borderBottom: '1px solid #e8eaec',
                            borderRight: '1px solid #e8eaec'
                        },
                        modalClasses: ['jspreviewer'],
                        maskStyle: {
                            display: 'block',
                            width: '100%'
                        },
                        iframeStyle: {},
                        gridX: 0, gridY: 0,
                        msg_ui: null,
                        showLog: true,
                        followNewLog: true,
                        logList: [],
                        tool: null,
                        // showDevTool: false,
                        // Inspector: false,
                        logType: ['sys', 'usr'],
                        logLevel: [3, 4, 5],
                        usrLogLevel: 5,
                        sysLogLevel: 5,
                        logDivColumns: [
                            {
                                title: OB_IDE.$t('消息'),
                                key: 'msg',
                                className: 'logTableColumnNormal',
                            },
                            {
                                title: OB_IDE.$t('来源'),
                                key: 'stackpath',
                                className: 'logTableColumnNormal',
                                render: (h, params) => {
                                    return h('div', [
                                        h('a', {
                                            on: {
                                                click: this.clickTableCell(params.row)
                                            },
                                        }, params.row.stackpath)
                                    ]);
                                }
                            },
                            {
                                title: OB_IDE.$t('类型'),
                                key: 'type',
                                className: 'logTableColumnType logTableColumnNormal',
                                width: '35px',
                                filters: [
                                    {
                                        label: OB_IDE.$t('系统'),
                                        value: 1
                                    },
                                    {
                                        label: OB_IDE.$t('用户'),
                                        value: 2
                                    }
                                ],
                                filterMultiple: false,
                                filterMethod(value, row) {
                                    if (value === 1) {
                                        return row.type === 'sys';
                                    } else if (value === 2) {
                                        return row.type === 'usr';
                                    }
                                }
                            },
                            {
                                title: OB_IDE.$t('等级'),
                                key: 'level',
                                className: 'logTableColumnLevel logTableColumnNormal',
                                width: '35px',
                                filters: [
                                    {
                                        label: 0,
                                        value: 0
                                    },
                                    {
                                        label: 1,
                                        value: 1
                                    },
                                    {
                                        label: 2,
                                        value: 2
                                    },
                                    {
                                        label: 3,
                                        value: 3
                                    },
                                    {
                                        label: 4,
                                        value: 4
                                    },
                                    {
                                        label: 5,
                                        value: 5
                                    },
                                    {
                                        label: 6,
                                        value: 6
                                    },
                                    {
                                        label: 7,
                                        value: 7
                                    },
                                    {
                                        label: 8,
                                        value: 8
                                    },
                                    {
                                        label: 9,
                                        value: 9
                                    },
                                    {
                                        label: 10,
                                        value: 10
                                    },
                                ],
                                // filteredValue: [3, 4, 5, 6],
                                filterMultiple: true,
                                filterMethod(value, row) {
                                    return row.level === value;
                                }
                            },
                            {
                                title: OB_IDE.$t('时间'),
                                key: 'time',
                                className: 'logTableColumnTime logTableColumnNormal',
                                width: '60px'
                            },
                        ],
                    }
                },
                computed: {},
                methods: {
                    addComponent(compInfo) {
                        console.log(compInfo);
                        this.components.push(compInfo);
                        this.tool = 'component';
                    },
                    async screenshot(evt) {
                        let imgBlob = evt.data.arg;
                        let buffer = await imgBlob.arrayBuffer();
                        OpenBlock.VFS.partition.info.put('thumbnail.jpg', buffer);
                        let base64 = OpenBlock.Utils.arrayBufferToBase64(buffer);

                        OpenBlock.VFS.partition.config.get('project.json', p => {
                            p.thumbnail = 'data:image/png;base64, ' + base64;
                            OpenBlock.VFS.partition.config.put('project.json', p);
                        });
                    },
                    saveAsThumbnail() {
                        let screenshot = {
                            "cmd": "screenshot"
                        };
                        this.$refs.iframe.contentWindow.postMessage(screenshot);
                    }, requestFullScreen() {
                        let screenshot = {
                            "cmd": "requestFullScreen"
                        };
                        this.$refs.iframe.contentWindow.postMessage(screenshot);
                    },
                    clickTableCell(d) {
                        let that = this;
                        return () => {
                            that.tableCell(d);
                        }
                    },
                    tableCell(data) {
                        this.$root.gotoSrc(data.block);
                        // if (data.cmd === 'text') {
                        //     this.$root.gotoSrc(data.block);
                        //     return;
                        // }
                        // switch (data.msg) {
                        //     default:
                        //         this.$root.gotoSrc(data.block);
                        // }
                    },
                    restart() {
                        let runProjectCmd = {
                            "cmd": "restart",
                            fsm: "Start.Main"
                        };
                        this.$refs.iframe.contentWindow.postMessage(runProjectCmd);
                    },
                    clearLog() {
                        this.logList = [];
                    },
                    logLevelChange() {
                        let arg = { usrLogLevel: this.usrLogLevel, sysLogLevel: this.sysLogLevel };
                        let drawGrid = {
                            "cmd": "setLogFilter",
                            "arg": arg
                        };
                        this.$refs.iframe.contentWindow.postMessage(drawGrid);
                        console.log(arg);
                    },
                    gridChange() {
                        let arg = { x: Math.abs(parseInt(this.gridX)), y: Math.abs(parseInt(this.gridY)) };
                        let drawGrid = {
                            "cmd": "drawGrid",
                            "arg": arg
                        };
                        this.$refs.iframe.contentWindow.postMessage(drawGrid);
                        console.log(arg);
                    },
                    changeScreen(evt) {
                        this.style.height = evt.target.value;
                    },
                    toggleFollowNewLog() {
                        this.followNewLog = !this.followNewLog;
                    },
                    onVisibleChange(v) {
                        if (!v) {
                            OB_IDE.removeComponent(this);
                        }
                    },
                    receiveMessage(event) {
                        if (event.source != this.$refs.iframe.contentWindow) {
                            return;
                        }
                        let cmd = event.data.cmd;
                        if (this[cmd]) {
                            this[cmd](event);
                        }
                    },
                    mousemove(evt) {
                        let v = evt.data.arg;
                        this.mousePosition = v;
                    },
                    debug(evt) {
                        if (evt.data.name === "Message received"
                            && evt.data.args.msg === "animationframe"
                            && evt.data.args.type === "event") {
                            return;
                        }
                        let msg = evt.data;
                        let args = Object.assign({}, msg.block, msg.args);
                        if (msg && msg.name) {
                            if (msg.name === 'Error') {
                                msg.msg = sprintf(this.$t(msg.args.title || msg.args.message), args);
                            } else {
                                msg.msg = sprintf(this.$t(msg.name), args);
                            }
                        }
                        msg.type = 'sys';
                        switch (msg.name) {
                            case 'FSM created':
                                msg.stackpath = sprintf('%(fsm)s-%(state)s', args);
                                break;
                            case 'Event received':
                                msg.stackpath = sprintf('%(fsm)s-%(state)s', args);
                                break;
                            default:
                                if (msg.block.fsm) {
                                    msg.stackpath = sprintf('%(fsm)s-%(state)s-%(func)s', args);
                                } else if (msg.block.fsmType) {
                                    msg.stackpath = sprintf('%(fsmType)s-%(state)s-%(func)s', args);
                                }
                        }
                        this.putLog(msg);
                    },
                    putLog(v) {
                        function checkTime(i) {
                            if (i < 10) {
                                i = "0" + i;
                            }
                            return i;
                        }
                        var today = new Date();//定义日期对象   
                        var hh = today.getHours();//通过日期对象的getHours方法返回小时   
                        var mm = today.getMinutes();//通过日期对象的getMinutes方法返回分钟   
                        var ss = today.getSeconds();//通过日期对象的getSeconds方法返回秒  
                        mm = checkTime(mm);
                        ss = checkTime(ss);
                        let time = hh + ':' + mm + ':' + ss;
                        v.time = time;
                        this.logList.push(v);
                        if (this.logList.length > 5000) {
                            this.logList.shift();
                        }
                        if (this.followNewLog) {
                            let div = this.$refs.logDiv;
                            div.scrollTop = Number.MAX_SAFE_INTEGER;
                        }
                        if (v.level >= 5) {
                            if (!v.stype) {
                                if (v.level >= 8) {
                                    v.stype = 'error';
                                } else if (v.level == 7) {
                                    v.stype = 'warning';
                                } else if (v.level == 6) {
                                    v.stype = 'success';
                                } else {
                                    v.stype = 'processing';
                                }
                            }
                            if (!v.content) {
                                v.content = v.msg;
                            }
                            this.msg_ui = v;
                        }
                    },
                    log(evt) {
                        let v = evt.data.arg;
                        this.putLog(v);
                    },
                    msg(evt) {
                        let msg = evt.data.arg;
                        if (msg && msg.format) {
                            msg.content = sprintf(OB_IDE.$t(msg.info.title), msg.info.args);
                        }
                        this.msg_ui = msg;
                    },
                    runProject(bytes, scene, transfer) {
                        this.bytes = bytes;
                        this.scene = scene;
                        let assets = {};
                        let arr_assets = transfer || [];
                        if (OpenBlock.VFS.partition.assets) {
                            let datas = OpenBlock.VFS.partition.assets._storage.datas
                            for (let key in datas) {
                                let d = datas[key].slice(0);
                                assets[key] = d;
                                arr_assets.push(d);
                            }
                        }
                        bytes = toRaw(bytes);
                        assets = toRaw(assets);
                        let runProjectCmd = { "cmd": "runProject", bytes, assets };
                        let iframe = this.$refs.iframe;
                        iframe.contentWindow.window.onload = () => {
                            iframe.contentWindow.postMessage(runProjectCmd, arr_assets);
                        };
                        iframe.contentWindow.postMessage(runProjectCmd, arr_assets);
                    },
                    onClickIframeMask() {
                        this.maskStyle.display = 'none';
                        this.modalClasses = ['jspreviewer', 'current'];
                        nextTick().then(() => {
                            this.$refs.iframe.focus();
                            this.$refs.iframe.contentWindow.focus();
                        });
                    }
                },
                mounted() {
                    window.addEventListener("message", this.receiveMessage);
                    let iframe = this.$refs.iframe;
                    let that = this;
                    function mask() {
                        that.maskStyle.display = 'block';
                        that.modalClasses = ['jspreviewer'];
                        that.maskStyle.width = iframe.parentElement.clientWidth + 'px';
                    }
                    iframe.onload = () => {
                        this.runProject(this.bytes, this.scene);
                        mask();
                        iframe.onblur = mask;
                        iframe.contentWindow.onblur = mask;
                        iframe.contentDocument.onblur = mask;
                        nextTick().then(() => {
                            this.maskStyle.display = 'none';
                            this.modalClasses = ['jspreviewer', 'current'];
                            iframe.focus();
                            iframe.contentWindow.focus();
                        });
                    };
                },
                beforeUnmount() {
                    window.removeEventListener('message', this.receiveMessage);
                    let i = this.manager.windows.indexOf(this);
                    this.manager.windows.splice(i, 1);
                }
            })
        })
    })
});
export default class IframeSimulator {
    static id = 0;
    windows = [];
    browser_run_window;
    url = '../jsruntime/test/index.html';
    componentMap = new Map();
    constructor(url) {
        if (url) {
            this.url = url;
        }
    }
    addComponent(name, icon, component, props) {
        if (!this.componentMap.has(name)) {
            component = toRaw(component);
            this.componentMap.set(name, { name, icon, component, props });
        } else {
            throw Error('重复组件: ' + name);
        }
    }
    removeComponent(name) {
        this.componentMap.delete(name);
    }
    runProject(buf, scene, transfer) {
        if (this.windows.length == 0) {
            this.newWindow(buf, scene, transfer);
        } else {
            let ws = this.windows.filter(w => w.sceneID == scene.id);
            if (ws.length > 0) {
                ws.forEach(w => {
                    w.title = scene.name;
                    w.runProject(buf, scene, transfer);
                });
            } else {
                this.newWindow(buf, scene, transfer);
            }
        }
    }
    standaloneWindow(bytes, scene) {
        let wait = false;
        if ((!this.browser_run_window) || this.browser_run_window.closed) {
            this.browser_run_window = window.open(this.url, 'ob_run_window', "width=375,height=540,resizable,scrollbars=no,status=no,alwaysRaised=on,top=100,left=100");
            wait = true;
        }
        let assets = {};
        let arr_assets = [];
        if (VFS.partition.assets) {
            let datas = VFS.partition.assets._storage.datas
            for (let key in datas) {
                let d = datas[key].slice(0);
                assets[key] = d;
                arr_assets.push(d)
            }
        }
        let runProjectCmd = { "cmd": "runProject", bytes, assets };
        if (wait) {
            this.browser_run_window.onload = () => {
                this.browser_run_window.postMessage(runProjectCmd, arr_assets);
                this.browser_run_window.focus();
            };
        } else {
            this.browser_run_window.postMessage(runProjectCmd, arr_assets);
            this.browser_run_window.focus();
        }

    }
    async newWindow(buf, scene, transfer) {
        let win = await OB_IDE.addComponent(IframePreviewer);
        win.id = ++IframeSimulator.id;
        win.title = scene.name;
        win.manager = this;
        win.sceneID = scene.id;
        win.url = this.url;
        this.componentMap.forEach((comp, key) => {
            win.addComponent(comp);
        });
        this.windows.push(win);
        win.runProject(buf, scene, transfer);
    }
}