
import SceneManager from '../SceneManager.mjs';
(function () {
    class Updater extends OpenBlock.VersionUpdater {
        constructor() {
            super(1);
        }
        async update(runPrevVersionUpdate) {
            let p = new Promise(async (resolve, reject) => {
                OpenBlock.VFS.partition.config.get('project.json', async p => {
                    if (p) {
                        if (p.version == 2) {
                            resolve();
                            return;
                        }
                        if ((!p.version) || p.version < 1) {
                            await runPrevVersionUpdate();
                            await this.update(runPrevVersionUpdate);
                            return;
                        }
                    }
                    OpenBlock.VFS.partition.config.get('entry.json', async e => {
                        let sceneTemplate = SceneManager.getAvailableScene('web');
                        if (sceneTemplate) {
                            let scene = SceneManager.scenes.find(s => s.baseName == 'web') || SceneManager.createScene(sceneTemplate);
                            if (sceneTemplate.beforeCreate) {
                                scene = await sceneTemplate.beforeCreate(scene);
                            }
                            if (scene) {
                                scene.entry = (e && e.web) || 'Start.Main';
                                scene.srcList = OpenBlock.BlocklyParser.loadedFiles.srcs.map(
                                    src => {
                                        if (src.env.indexOf('web') < 0) {
                                            src.env.push('web');
                                        }
                                        return src.name
                                    });
                                scene.name = OpenBlock.i('web');
                                try {
                                    SceneManager.applyScene(scene);
                                } catch (e) {
                                    console.error(e);
                                }
                            }
                        }
                        p.version = 2;
                        OpenBlock.VFS.partition.config.put('project.json', p);
                        console.info('升级程序版本到 v2');
                        resolve();
                    });
                });
            });
            return p;
        }
    }
    OpenBlock.Version.addUpdater(new Updater());
})();