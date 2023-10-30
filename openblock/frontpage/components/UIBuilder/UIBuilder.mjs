
import { DynamicComponent, DynamicComponentGroup, DynamicComponentEditor } from '../SimpleDomEditor/vue3-simpledomeditor.mjs';
import { defineComponent, defineAsyncComponent, resolveComponent } from 'vue';
function baseProps() {
    return {
        id: OpenBlock.Utils.makeSN(),
    };
}
const supportedComponent = {
    'Button': {
        name: 'Button', native: false, container: true,
        info: 'UI_COMP_BUTTON_HELP',
        createProps() {
            return Object.assign(baseProps('Button'), {
            });
        }
    },
    'div': {
        name: 'div', native: true, icon: 'ios-document-outline', container: true,
        info: 'UI_COMP_DIV_HELP'
    },
    'span': {
        name: 'span', native: true, container: true,
        info: 'UI_COMP_SPAN_HELP'
    },
    'p': {
        name: 'p', native: true, container: true,
        info: 'UI_COMP_P_HELP'
    },
};
const category = [
    { name: "base", components: ['Button', 'span', 'p'] },
    { name: 'container', components: ['div'] },
];
function defaultPages() {
    return [{
        // type: 'div',
        // title: OpenBlock.i('启动页面'),
        UICompontent: {
            type: 'div',
            name: OpenBlock.i('启动页面'),
            props: {
                id: OpenBlock.Utils.makeSN(),
            },
        },
        expand: true, contextMenu: true,
        children: [
        ]
    }];
}

let OptionButton = defineComponent({
    props: ['compData', 'page'],
    data() {
        return {
            supportedComponent,
            compTemplate: null,
            addTarget: null
        }
    },
    watch: {
    },
    mounted() {
        this.compTemplate = supportedComponent[this.compData.UICompontent.type];
    },
    methods: {
        async addChild() {
            await this.openSelect();
        },
        async addBrother() {
            await this.openSelect();
        },
        async openSelect() {
            // let win = await OB_IDE.addComponent(CompSelectWindow);
            // win.selected = this.add.bind(this);
        },
        add(c) {
            debugger
        }
    },
    template: `
    <Poptip v-if="compData && compTemplate" transfer trigger="hover" content="content" placement="right">
        <span><icon type="md-arrow-round-forward" :size="20"></icon></span>
        <template #content>
        <Button @click="addChild"><Icon type="ios-arrow-up" />{{$t('向上移动')}}</Button><br/>
        <Button @click="addChild"><Icon type="ios-arrow-down" />{{$t('向下移动')}}</Button><br/>
        <Button @click="addBrother"><Icon type="ios-arrow-back" />{{$t('移动到上层')}}</Button>
        </template>
    </Poptip>
    `,
});
let UIBuilder = defineAsyncComponent(async () => {
    return {
        template: (await axios('./components/UIBuilder/UIBuilder.html')).data,
        components: {},
        data() {
            return {
                category,
                searchText: null,
                supportedComponent,
                enabled: false,
                scene: null,
                page: null,
                tab1: null,
                previewScale: 0.19,
                previewWidth: 1080,
                previewHeight: 2400,
                rotated: false,
                previewStyle: {
                    margin: '0',
                    border: 'none',
                    height: '2400px',
                    width: '1080px',
                    'transform-origin': '0% 0%',
                    transform: 'scale(0.5)'
                },
                previewWrapperStyle: {
                    margin: '5px',
                    height: '1200px',
                    width: '540px',
                    border: 'none',
                    'max-width': '100%',
                    'max-height': '100%'
                },
                predefinedScreen: [
                    { name: 'Redmi Note 12 Turbo', width: 1080, height: 2400 },
                    { name: 'Apple iPhone 14 Pro', width: 1179, height: 2556 },
                    { name: 'PC', width: 2560, height: 1440 },
                ],
                selectedComp: null
            }
        },
        watch: {
            rotated(rotated) {
                this.updatePreview();
            },
            previewScale(v) {
                this.updatePreview();
            },
            previewHeight(v) {
                this.updatePreview();
            },
            previewWidth(v) {
                this.updatePreview();
            },
            enabled(v, v1) {
                if (!v) {
                    OpenBlock.VFS.partition.config.put(`vue-${this.scene.id}.json`, this.page);
                    OB_IDE.removeComponent(this);
                }
            },
            scene(newV) {
                let that = this;
                OpenBlock.VFS.partition.config.get(`vue-${newV.id}.json`, (conf) => {
                    if (conf) {
                        that.page = conf;
                    } else {
                        that.page = defaultPages();
                        OpenBlock.VFS.partition.config.put(`vue-${newV.id}.json`, that.page);
                    }
                });
            }
        },
        mounted() { this.updatePreview(); },
        computed: {
            isLandscape() {
                // return this.previewHeight > this.previewWidth;
                return this.rotated ? this.previewHeight > this.previewWidth : this.previewWidth > this.previewHeight;
            }
        },
        methods: {
            createComponet(compType) {
                let info = this.supportedComponent[compType];
                let props = info.createProps();
                return {
                    UICompontent: {
                        name: OpenBlock.i('UI-' + compType), type: compType, props
                    }, children: []
                };
            },
            appendComponentIn(compType, container) {
                let data = this.createComponet(compType);
                container.children.push(data);
            },
            getParent(comp) {
                let current = this.page;
                while (current != null) {
                    debugger
                }
            },
            addComponent(comp) {
                if (!this.selectedComp) {
                    return;
                }
                let selectedCompType = this.selectedComp.UICompontent.type;
                let info = this.supportedComponent[selectedCompType];
                if (!info) {
                    console.error('not support ' + selectedCompType);
                    return;
                }
                if (info.container) {
                    this.appendComponentIn(comp, this.selectedComp);
                } else {
                    let container = this.getParent(this.selectedComp.UICompontent);
                    if (container) {
                        this.appendComponentIn(comp, container);
                    }
                }
            },
            selectChanged(arr, target) {
                this.selectedComp = target;
            },
            renderContent(h, { root, node, data }) {
                let compType = data.UICompontent.type;
                let compInfo = supportedComponent[compType];
                // let comp = compInfo.native ? compType : resolveComponent(compType);
                let children = [
                    h(resolveComponent('icon'), { type: compInfo.icon }),
                    data.UICompontent.name,
                ];
                if (this.selectedComp == data) {
                    children.push(
                        h(OptionButton, { compData: data, tree: this.page }));
                }
                let r = h('span', {}, children);
                return r;
            },
            updatePreview() {
                this.previewStyle.transform = `scale(${this.previewScale})`;
                if (this.rotated) {
                    this.previewStyle.width = `${this.previewHeight}px`;
                    this.previewStyle.height = `${this.previewWidth}px`;
                    this.previewWrapperStyle.width = `${this.previewHeight * this.previewScale}px`;
                    this.previewWrapperStyle.height = `${this.previewWidth * this.previewScale}px`;
                } else {
                    this.previewStyle.width = `${this.previewWidth}px`;
                    this.previewStyle.height = `${this.previewHeight}px`;
                    this.previewWrapperStyle.width = `${this.previewWidth * this.previewScale}px`;
                    this.previewWrapperStyle.height = `${this.previewHeight * this.previewScale}px`;
                }
            },
            setScreen(screen) {
                this.previewWidth = screen.width;
                this.previewHeight = screen.height;
            },
            handleContextMenu(data, event, position) {
                debugger
                this.selectedComp = data;
            },
            handleContextMenuEdit() {
                this.$Message.info('Click edit of' + this.selectedComp.title);
            },
            handleContextMenuDelete() {
                this.$Message.info('Click delete of' + this.selectedComp.title);
            }
        }
    }
});
UIBuilder.open = async function (scene) {
    await OpenBlock.saveAllSrc();
    let closemsg;
    try {
        closemsg = OB_IDE.$Message.loading({
            content: OB_IDE.$t('正在编译'),
            duration: 0
        });
        // showOverallLoading();
        OB_IDE.closeSider();
        OB_IDE.closeAllTabs();
        let buf = await OpenBlock.exportExePackage(scene);
        console.log('编译完成');
        let win = await OB_IDE.addComponent(UIBuilder);
        win.scene = scene;
        win.enabled = true;
    } catch (e) {
        OB_IDE.$Message.error(OB_IDE.$t('编译失败:') + e.message);
    } finally {
        // hideOverallLoading();
        closemsg();
    }
};
export default UIBuilder;