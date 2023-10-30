(function () {
    class Updater extends OpenBlock.VersionUpdater {
        constructor() {
            super(0);
        }
        async update() {
            let p = new Promise((resolve, reject) => {
                OpenBlock.VFS.partition.config.get('project.json', p => {
                    if (p) {
                        if (p.version) {
                            resolve();
                            return;
                        }
                    }
                    p.version = 1;
                    OpenBlock.VFS.partition.config.put('project.json', p);
                    OpenBlock.VFS.partition.config.put('entry.json', { web: 'Start.Main' });
                    OpenBlock.BlocklyParser.loadedFiles.srcs.forEach(src => {
                        src.env = ['web'];
                        OpenBlock.VFS.partition.src.put(src.name + '.xs', src);
                    });
                    console.info('升级程序版本到 v1');
                    resolve();
                });
            });
            return p;
        }
    }
    OpenBlock.Version.addUpdater(new Updater());
})();