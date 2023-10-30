import ViewUIPlus from 'view-ui-plus'
import { nextTick, createApp, markRaw } from 'vue';
import logic from './htmls/logic/logic.mjs';
import dataset from './htmls/dataset/index.mjs';
import assets from './htmls/assets/assets.mjs';
import errorpanel from './htmls/errorpanel/errorpanel.mjs';
import i18n from './i18n.mjs';
import obop from './obop.mjs';
import uiUtils from './uiutils.mjs';
import projectname from './htmls/projectname/projectname.mjs';
// import './htmls/editorSettings/editorSettings.mjs';
import envConfig from '../../static/envConfig.js';
let onIDEInitedCallbacks = [];
let inited = false;
window.onIDEInited = function (cb) {
    if (inited) {
        setTimeout(() => {
            try {
                cb();
            } catch (e) {
                console.error(e);
            }
        }, 0);
    } else {
        onIDEInitedCallbacks.push(cb);
    }
}
function callOnInited() {
    inited = true;
    onIDEInitedCallbacks.forEach((cb) => {
        try {
            cb();
        } catch (e) {
            console.error(e);
        }
    });
    onIDEInitedCallbacks = null;
}
let app = createApp({
    components: {
        logic,
        projectname,
        dataset,
        assets,
        errorpanel
    },
    data() {
        return {
            openedSider: 'logic',
            siders: [
                {
                    icon: 'md-analytics',
                    component: 'logic',
                    name: this.$t('逻辑'),
                    isEnabled: "datasetUIEnabled"
                },
                {
                    icon: 'md-filing',
                    component: 'dataset',
                    name: this.$t('数据'),
                    isEnabled: "datasetUIEnabled"
                },
                {
                    icon: 'ios-folder',
                    component: 'assets',
                    name: this.$t('资产'),
                    isEnabled: "datasetUIEnabled"
                },
            ],
            tabs: [],
            showingTabName: null,
            openWithTable: {},
            modalWindows: [],
            toolbarItems: [],
            rightToolbarItems: [],
            siderBottomBottons: [],
            footerComponents: [],
            customElements: [],
            customElementId: 0,
            editorSettings: null,
        }
    },
    computed: {
        datasetUIEnabled() {
            return this.checkUIEnabled("dataset");
        }
    },
    methods: {
        checkUIEnabled(name) {
            if (!this.editorSettings || !this.editorSettings.settings) {
                return true;
            }
            if (this.editorSettings.settings.enabledUI.indexOf(name) > -1) {
                return true;
            }
            return false;
        },
        removeComponent(componentInstance) {
            for (let i = 0; i < this.customElements.length; i++) {
                let ele = this.customElements[i];
                if (ele.instance == componentInstance) {
                    this.customElements.splice(i, 1);
                    return;
                }
            }
        },
        async addComponent(component) {
            component = markRaw(component);
            let ele = { component, id: this.customElementId++ };
            this.customElements.push(ele);
            let ref = 'customElement-' + ele.id;
            let p = new Promise((resolve, reject) => {
                let that = this;
                function f() {
                    // let instance = that.$refs[ref][0].$.data;
                    ele.instance = that.$refs[ref][0];
                    resolve(ele.instance);
                };
                function c() {
                    if (that.$refs[ref]) {
                        f();
                    } else {
                        // nextTick().then(c);
                        setTimeout(() => {
                            c();
                        }, 100);
                    }
                }
                c();
            });
            return p;
        },
        openModal(options) {
            let that = this;
            let win = Object.assign({
                title: '',
                closable: true,
                maskClosable: true,
                draggable: false,
                sticky: false,
                stickyDistance: 10,
                mask: false,
                width: '50vw',
                footerHide: true,
                display: true,
                component: null,
                componentOptions: null,
                beforeClose() {
                    let idx = that.modalWindows.indexOf(win);
                    if (idx >= 0) {
                        that.modalWindows.splice(idx, 1);
                    }
                },
                close() {
                    let idx = that.modalWindows.indexOf(win);
                    if (idx >= 0) {
                        that.modalWindows.splice(idx, 1);
                    }
                }
            }, options);
            if (win.component) {
                win.component = markRaw(win.component);
            }
            win.id = OpenBlock.Utils.makeSN();
            this.modalWindows.push(win);
            let ref = 'modal-' + win.id;
            let p = new Promise((resolve, reject) => {
                let that = this;
                function f() {
                    let dom = document.getElementById('modal-content-' + win.id);
                    let component = that.$refs[ref][0].$.data;
                    resolve({ dom, options: win, component });
                };
                function c() {
                    if (that.$refs[ref]) {
                        f();
                    } else {
                        // nextTick().then(c);
                        setTimeout(() => {
                            c();
                        }, 100);
                    }
                }
                c();
            });
            return p;
        },
        exportProjectZip() {
            VFS.partition.config.get('project.json', (proj) => {
                let projectName = (proj && proj.name) || 'project';
                OpenBlock.exportProjectZip((content) => {
                    FileOD.Save(projectName + '.obp', content);
                });
            });
        },
        importProjectZip() {
            FileOD.Open('.zip,.obp', 'ArrayBuffer', (file) => {
                OpenBlock.importProjectZip(file.content, () => {
                    this.compiling = true;
                    OpenBlock.Version.updateVersion();
                    console.log('load zip finished.');
                    OpenBlock.DataImporter.excel.reimportAll();
                    OpenBlock.compileAllSrc();
                    VFS.partition.config.get('project.json', (proj) => {
                        if (proj && proj.name) {
                            this.projectName = proj.name;
                        } else {
                            this.projectName = null;
                        }
                        OB_IDE.$Message.success(this.$t('工程加载完成'));
                        this.compiling = false;
                    });
                });
            }, false);
        },
        registerOpenWith(fileType, name, openFunction, that) {
            if (Array.isArray(fileType)) {
                fileType.forEach(t => {
                    this.registerOpenWith(t, name, openFunction, that);
                });
                return;
            }
            let list = this.openWithTable[fileType];
            if (!list) {
                list = [{ name, openFunction, that }];
                this.openWithTable[fileType] = list;
            } else {
                list.push({ name, openFunction, that });
            }
        },
        openFileWith(fileType, openWith, ...arg) {
            let list = this.openWithTable[fileType];
            if (!list || list.length == 0) {
                this.$Message.error(this.$t('无法打开文件类型') + ' ' + fileType);
            } else {
                let func = list.find((v) => v.name === openWith) || list[list.length - 1];
                func.openFunction.apply(func.that, arg);
            }
        },
        openFile(fileType, ...arg) {
            let list = this.openWithTable[fileType];
            if (!list || list.length == 0) {
                this.$Message.error(this.$t('无法打开文件类型') + ' ' + fileType);
            } else {
                let func = list[list.length - 1];
                arg.unshift(fileType);
                func.openFunction.apply(func.that, arg);
            }
        },
        addToolbarItem(options) {
            this.toolbarItems.push(options);
            this.toolbarItems.sort((a, b) => a.index - b.index);
        },
        addRightToolbarItem(options) {
            this.rightToolbarItems.push(options);
            this.rightToolbarItems.sort((a, b) => a.index - b.index);
        },
        addSiderBottomBotton(options) {
            this.siderBottomBottons.push(options);
            this.siderBottomBottons.sort((a, b) => a.index - b.index);
        },
        addFooterComponent(options) {
            this.footerComponents.push(options);
            this.footerComponents.sort((a, b) => a.index - b.index);
        },
        removeFooterComponent(opt) {
            let idx = this.footerComponents.indexOf(opt);
            if (idx > -1) {
                this.footerComponents.splice(idx, 1);
            }
        },
        /**
         * key:唯一名称 如：'src://' + src.name + '/' + fsm.name + '/' + state.name + '.state'
         * target:编辑的对象
         * labelBuilder:绘制标签的vue渲染函数
         * builderFunc:Function<Tab,Document> 内容渲染回调
         * @param {Object} a { key, target, labelBuilder, builderFunc } 
         */
        openTab(a) {
            let { key, target, labelBuilder, builderFunc, onClose } = a;
            let workspace = this.tabs.find(info => info.key === key);
            if (workspace) {
                this.showingTabName = workspace.name;
            } else {
                // let self = this;
                let newTab = {
                    name: OpenBlock.Utils.makeSN(),
                    label: labelBuilder,
                    content: null,
                    key: key,
                    target,
                    contentBuilder: (dom) => { return builderFunc(dom, newTab); },
                    dom: null,
                    onClose
                };
                this.tabs.push(newTab);
                this.showingTabName = newTab.name;

                nextTick(function () {
                    let dom = document.getElementById('tabContent-' + newTab.name);
                    newTab.dom = dom;
                    newTab.content = newTab.contentBuilder(dom);
                });
            }
            this.siderUsing = null;
        },
        getTab(key) {
            return this.tabs.find(t => t.key == key);
        },
        closeAllTabs() {
            let tabs = [...this.tabs];
            tabs.forEach(tab => {
                this.closeTab(tab.key);
            });
        },
        closeTab(key) {
            const index = this.tabs.findIndex(t => t.key === key);
            if (index > -1) {
                let tab = this.tabs[index];
                this.tabs.splice(index, 1);
                if (index >= this.tabs.length) {
                    if (this.tabs.length > 0) {
                        this.showingTabName = this.tabs[this.tabs.length - 1].name;
                    } else {
                        this.showingTabName = null;
                    }
                }
                if (tab.onClose) {
                    tab.onClose(tab);
                }
            }
        },
        closeSider() {
            this.openedSider = null;
        },
        openSider(s) {
            this.openedSider = s;
        },
        triggleSider(componentName) {
            if (this.openedSider === componentName) {
                this.openedSider = null;
            } else {
                this.openedSider = componentName;
            }
        },
        initOB() {
            let stateToolbox, functionToolbox, actionGroupToolbox;
            let config;
            function buildBlockly() {
                config.uiCallbacks = {
                    // addFsmVariable: showCreateVarDiv(OpenBlock.addFSMVariable),
                    // addStateVariable: showCreateVarDiv(OpenBlock.addStateVariable),
                    // confirm: asyncConfirm,
                    // prompt: AsyncPrompt.prompt
                };
                config.toolbox = {
                    state: stateToolbox,
                    function: functionToolbox,
                    actionGroup: actionGroupToolbox,
                };
                OpenBlock.init({
                    stubToolbox: false,
                    uiCallbacks: config.uiCallbacks,
                    extI18NPath: 'i18n/',
                    toolbox: config.toolbox,
                    blocklyOpt: config.blocklyOpt || {
                        grid: {
                            spacing: 25,
                            length: 3,
                            "colour": "#F3F3F3",
                            snap: false
                        },
                        move: {
                            scrollbars: true,
                            drag: true,
                            wheel: true
                        },
                        // maxBlocks: 65535,
                        zoom: {
                            'controls': true,
                            'wheel': true,
                            minScale: 0.7,
                        },
                        scrollbars: true,
                        sounds: false,
                        comments: true,
                        disable: true
                    }
                });
            }
            let promises = [];
            promises.push(axios({
                type: 'GET',
                url: 'core/xml/stateToolbox.xml',
                responseType: 'text',
                async: false,
            }).then(({ data }) => {
                stateToolbox = data;
            }));
            promises.push(axios({
                type: 'GET',
                url: 'core/xml/functionToolbox.xml',
                responseType: 'text',
                async: false
            }).then(({ data }) => {
                functionToolbox = data;
            }));
            promises.push(axios({
                type: 'GET',
                url: 'core/xml/actionGroupToolbox.xml',
                responseType: 'text',
                async: false
            }).then(({ data }) => {
                actionGroupToolbox = data;
            }));
            promises.push(axios({
                url: 'config/openblock.json',
                responseType: 'json',
                async: false
            }).then(({ data }) => {
                config = data;
            }))
            Promise.all(promises).then(buildBlockly);
        }
    },
    mounted() {
        OpenBlock.onInited(() => {
            envConfig();
            document.getElementById('openblock').style.display = 'block';
            window.hideOverallLoading();
            callOnInited();
        });
        this.initOB();
        window.OB_IDE = this;
    },
});
app.use(i18n);
app.use(ViewUIPlus, { i18n: app.config.globalProperties.i18n });
app.use(uiUtils);
app.use(obop);
// app.config.errorHandler = (err) => {
//     /* 处理错误 */
//     console.error(err);
// };
app.mount('#openblock');