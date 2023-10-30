/**
 * @license
 * Copyright 2021 Du Tian Wei
 * SPDX-License-Identifier: Apache-2.0
 */
import Template from '../jsruntime/developtools/template.mjs';
import IframeSimulator from '../iframeconnector/IframeSimulator.mjs';
import ToPython from '../jsruntime/developtools/python/ToPython.mjs'
import ToC from '../jsruntime/developtools/c/ToC.mjs';
import OpenBrotherSerialProtocol from './openBrotherSerialProtocol.mjs';
import SceneManager from '../frontpage/core/ub/SceneManager.mjs';
import '../frontpage/js/htmls/SceneManager/SceneManager.mjs';
export default async function () {
    await OpenBlock.Utils.loadJSAsync([
        // '../../js/htmls/SceneManager/SceneManager.mjs',
        "../jsruntime/test/env/i18n_zh.js",
        "../jsruntime/test/env/native.js"]);
    let openBrotherTemplate = await axios.get('../static/openBrother.template.py');
    openBrotherTemplate = Template.parseTemplate(openBrotherTemplate.data, '#');
    let simulator = new IframeSimulator();
    let scenes = [
        {
            name: 'web',
            env: 'web',
            beforeCreate(scene) {
                console.log('beforeCreate', scene);
                return scene;
            },
            beforeUpdate(scene) {
                console.log('beforeUpdate', scene);
                return scene;
            },
            runMethods: [
                {
                    icon: 'ios-play',
                    name: OB_IDE.$t('模拟器运行'),
                    async run(scene) {
                        await OpenBlock.saveAllSrc();
                        OpenBlock.exportExePackage(scene, (e, buf) => {
                            if (e) {
                                OB_IDE.$Message.error(OB_IDE.$t('编译失败'));
                            } else {
                                simulator.runProject(buf, scene);
                            }
                        });
                    }
                },
                {
                    icon: 'ios-apps',
                    name: OB_IDE.$t('新模拟器运行'),
                    async run(scene) {
                        await OpenBlock.saveAllSrc();
                        OpenBlock.exportExePackage(scene, (e, buf) => {
                            if (e) {
                                OB_IDE.$Message.error(OB_IDE.$t('编译失败'));
                            } else {
                                simulator.newWindow(buf, scene);
                            }
                        });
                    }
                },
                {
                    icon: 'ios-browsers',
                    name: OB_IDE.$t('独立窗口运行'),
                    async run(scene) {
                        await OpenBlock.saveAllSrc();
                        OpenBlock.exportExePackage(scene, (e, buf) => {
                            if (e) {
                                OB_IDE.$Message.error(OB_IDE.$t('编译失败'));
                            } else {
                                simulator.standaloneWindow(buf, scene);
                            }
                        });
                    }
                },
                {
                    icon: 'ios-code-download',
                    name: OB_IDE.$t('导出字节码'),
                    async run(scene) {
                        await OpenBlock.saveAllSrc();
                        OpenBlock.exportExePackage(scene, (e, buf) => {
                            if (e) {
                                OB_IDE.$Message.error(OB_IDE.$t('编译失败'));
                            } else {
                                FileOD.Save(scene.name + '.web.xe', new Blob([buf]));
                            }
                        });
                    }
                },
            ]
        },
        {
            name: "editorExt",
            env: "editorExt",
            runMethods: [
                {
                    icon: 'ios-code-download',
                    name: OB_IDE.$t('导出字节码'),
                    run(scene) {
                        OpenBlock.saveAllSrc();
                        OpenBlock.exportExePackage(scene, (e, buf) => {
                            if (e) {
                                OB_IDE.$Message.error(OB_IDE.$t('编译失败'));
                            }
                            FileOD.Save(scene.name + '.editorExt.xe', new Blob([buf]));
                        });
                    }
                },]
        },
        {
            name: "openBrother-C",
            env: "openBrother-C",
            runMethods: [
                {
                    icon: "md-game-controller-b",
                    name: OB_IDE.$t('下载C代码'),
                    async run(scene) {
                        let c = await ToC.buildLogicSrc({
                            env: scene.env,
                            srcList: scene.srcList,
                            entry: scene.entry,
                            envTemplate: openBrotherTemplate
                        });
                        console.log(c);
                        FileOD.Save(scene.name + '.openBrother.c', c);
                    }
                },
                {
                    icon: "ios-bonfire",
                    name: OB_IDE.$t('编译烧录'),
                    async run(scene) {
                        let c = await ToC.buildLogicSrc({
                            env: scene.env,
                            srcList: scene.srcList,
                            entry: scene.entry,
                            envTemplate: openBrotherTemplate
                        });
                        // let tokenInfo;
                        // try {
                        //     tokenInfo = (await axios.post('/service/request',
                        //         {
                        //             type: 'compiler',
                        //             arg: {
                        //                 target: 'OpenBrother3861'
                        //             }
                        //         })
                        //     ).data;
                        // } catch (e) {
                        //     OB_IDE.$Message.error(OpenBlock.i('请求失败'));
                        //     return;
                        // }
                        // const { url, token, result } = tokenInfo;
                        // if (result != 'success') {
                        //     let msgtype = result;
                        //     if (!OB_IDE.$Message[msgtype]) {
                        //         msgtype = 'warning';
                        //     }
                        //     OB_IDE.$Message[msgtype](OpenBlock.i(tokenInfo.msg));
                        //     return;
                        // }
                        // const formData = new FormData();
                        // formData.append('token', token);
                        // formData.append('file', c, 'openblock.logic.c');
                        // const config = {
                        //     headers: {
                        //         ...formData.getHeaders(),
                        //         'Content-Length': formData.getLengthSync()
                        //     }
                        // };
                        // axios.post(url, forData, config);
                        // L1: while (true) {
                        //     let data = (await axios('../static/3861/Hi3861_wifiiot_app_allinone.bin', {
                        //         responseType: 'arraybuffer'
                        //     })).data;
                        //     console.log(data);
                        //     switch (data.result) {
                        //         case 'success':
                        //             break L1;
                        //         case 'process':
                        //             break;
                        //         case 'fail':
                        //             return;
                        //     }
                        // }
                        // await (new HiBurn()).burn(file, { tool: 'HiBurn' });
                    }
                }
            ]
        },
        {
            name: "openBrother",
            env: "openBrother",
            runMethods: [
                {
                    icon: 'logo-python',//'md-download',
                    name: OB_IDE.$t('下载python代码'),
                    async run(scene) {
                        let py = await ToPython.buildLogicSrc({
                            pyVersion: '3.0',
                            env: scene.env,
                            srcList: scene.srcList,
                            entry: scene.entry,
                            envTemplate: openBrotherTemplate
                        });
                        FileOD.Save(scene.name + '.openBrother.py', py);
                    }
                },
                {
                    icon: 'ios-game-controller-a-outline',//'md-download',
                    name: OB_IDE.$t('Python运行'),
                    async run(scene) {
                        if (!navigator.serial) {
                            OB_IDE.$Message.error(OB_IDE.$t('当前浏览器不支持串口通信'));
                            return;
                        }
                        try {
                            let port = await navigator.serial.requestPort();
                            console.log(port);
                            let py = await ToPython.buildLogicSrc({
                                pyVersion: '3.0',
                                env: scene.env,
                                srcList: scene.srcList,
                                entry: scene.entry,
                                envTemplate: openBrotherTemplate
                            });
                            console.log(py.length);
                            let p = new OpenBrotherSerialProtocol(port);
                            try {
                                await p.open();
                            } catch (e) {
                                console.error(e);
                                OB_IDE.$Message.error(OB_IDE.$t('打开端口失败') + ':' + e.message);
                                return;
                            }
                            try {
                                await p.sendScript(py);
                            } catch (e) {
                                console.error(e);
                                OB_IDE.$Message.error(OB_IDE.$t('写入失败') + ':' + e.message);
                                return;
                            } finally {
                                p.close();
                            }
                        } catch (e) {

                            OB_IDE.$Message.warning(OB_IDE.$t('未选择串口设备'));
                            return;
                        }
                    }
                },
            ]
        },
        {
            name: "micro:bit",
            env: "microbit",
            runMethods: [
                {
                    icon: 'logo-python',//'md-download',
                    name: OB_IDE.$t('下载python代码'),
                    async run(scene) {
                        let py = await ToPython.buildLogicSrc({
                            pyVersion: '3.0',
                            env: scene.env,
                            srcList: scene.srcList,
                            entry: scene.entry,
                        });
                        FileOD.Save(scene.name + '.microbit.py', py);
                    }
                }
            ]
        }
    ];
    for (let i in scenes) {
        let s = scenes[i];
        if (!OpenBlock.Env.hasEnv(s.env)) {
            OpenBlock.Env.addNewEnv(s.env);
        }
        SceneManager.addAvailableScene(s);
    }

    OpenBlock.Utils.handleUrlHash(() => {
        OB_IDE.$Message.info(OB_IDE.$t('正在打开工程，请稍后'));
        simulator.loading = true;
        showOverallLoading();
    }, async (error, loaded) => {
        await OpenBlock.Version.updateVersion();
        await OpenBlock.compileAllSrc();
        simulator.loading = false;
        hideOverallLoading();
        OB_IDE.$Message.success(OB_IDE.$t('工程加载完成'));
    });
}