(function () {
    class Updater {
        version = 0;
        constructor(fromVersion) {
            this.version = fromVersion;
        }
        updater() { }
    }
    class Version {
        /**
         * @type Updater[]
         */
        updaters = [];
        async updateVersion() {
            let updaters = this.updaters.slice();
            async function runPrevVersionUpdate() {
                let updater = updaters.shift();
                await updater.update(runPrevVersionUpdate);
            }
            await runPrevVersionUpdate();
            // OpenBlock.VFS.partition.config.get('project.json', async p => {
            //     let v = p.version;
            //     if (!v) {
            //         v = 0;
            //     }
            //     for (let updater of this.updaters) {
            //         if (v <= updater.version) {
            //             await updater.update();
            //             this.updateVersion();
            //             return;
            //         }
            //     }
            // });
        }
        addUpdater(updater) {
            this.updaters.push(updater);
            this.updaters.sort((a, b) => b.version - a.version);
        }
    }
    OpenBlock.Version = new Version();
    OpenBlock.VersionUpdater = Updater;
})();