/**
 * @license
 * Copyright 2021 Du Tian Wei
 * SPDX-License-Identifier: Apache-2.0
 */
import { defineComponent, createApp, nextTick } from 'vue';
import ViewUIPlus from 'view-ui-plus'
OpenBlock.onInited(async () => {
    let [htmlTemplate] = await Promise.all([
        axios({
            url: 'js/htmls/dataviewer/DataViewer.html',
            responseType: 'text'
        }),
        OpenBlock.onInitedPromise()
    ]);

    let dataViewerCellBase = {
        props: ['value', "field"],
        data() {
            return {};
        },
        template: '<span>{{field.getValue(value)}}</span>'
    };
    let dataViewerCellStruct = {
        props: ['value', "field"],
        data() {
            if (this.field.type.isCollection()) {
                let obj = this.field.getValue(this.value);
                return { id: Object.keys(obj), name: this.field.type.elementType.name };
            } else {
                let obj = this.field.getValue(this.value);
                let registers = obj.registers;
                if (!registers) {
                    debugger
                }
                let integerR = registers.integer;
                let id = integerR[0];
                return { id, name: this.field.type.name };
            }
        },
        methods: {
            openDataTab(tableName) {
                OB_IDE.openFile('dataset', tableName, OpenBlock.DataImporter.dataReorganizingContext.compiled[tableName]);
            }
        },
        template: '<a @click="openDataTab(name)"><icon type="md-filing"></icon>{{name}}:{{id}}</a>'
    };
    StructField.prototype.getValue = function (data) {
        let rtype = this.type.registerType();
        let register = data.registers[rtype];
        let value = register[this.registerIndex];
        return value;
    }
    StructField.prototype.component = function () {
        if (this.type instanceof StructFieldTypeStruct) {
            return dataViewerCellStruct;
        }
        return dataViewerCellBase;
    }

    let DataViewer = defineComponent({
        template: htmlTemplate.data,
        // props: ['value'],
        data() {
            let sn = OpenBlock.Utils.makeSN()
            nextTick(function () {
                let dom = document.getElementById(sn);
                self.dom = dom;
            });

            return {
                sn,
                dom: null,
                page: {
                    current: 1,
                    size: 10,
                    sizeOpt: [10, 20, 30, 50, 70, 100, 500, 2000, 10000]
                }
            };
        },
        computed: {
            compiled() {
                let v = OpenBlock.DataImporter.dataReorganizingContext.compiled[this.value];
                return v;
            },
            ast() {
                let v = OpenBlock.DataImporter.dataReorganizingContext.structAST[this.value];
                return v;
            }
        },
        methods: {
            compiled1(col) {
                let c = OpenBlock.DataImporter.dataReorganizingContext.compiled[this.value];
                let v = c[col];
                return v;
            },
            onpagechange(p) {
                this.page.current = p;
            },
            onpagesizechange(s) {
                this.page.size = s;
            }
        },
        beforeDestroy() {
            if (this.beforedestroy) {
                this.beforedestroy(this.content);
            }
        },
    });
    OB_IDE.registerOpenWith(
        ['dataset'],
        'defaultStateSrcEditor',
        (fileType, name, table) => {
            let key = fileType + '://' + name;
            OB_IDE.openTab({
                key,
                target: table,
                labelBuilder(h) {
                    return h('div', { class: "ns bold", title: name }, [
                        h('i', { class: "ivu-icon ivu-icon-ios-cube" }),
                        name,
                        h('i', {
                            class: "ivu-icon ivu-icon-ios-close", onClick: function () {
                                OB_IDE.closeTab(key);
                            }
                        }
                        )]);
                },
                builderFunc(dom, tab) {
                    dom.innerHTML = "";
                    const dataviewapp = createApp(DataViewer, {
                        components: { ViewUIPlus },
                    });
                    dataviewapp.config.globalProperties = {
                        value: name, table
                    };
                    dom.append()
                    dataviewapp.mount(dom);
                    return {
                        dispose() {
                            dataviewapp.unmount();
                        }
                    };
                },
                onClose(tab) {
                    tab.content.dispose();
                }
            });
        });
});