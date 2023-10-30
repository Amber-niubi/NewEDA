
import { defineAsyncComponent,toRaw } from 'vue';
OpenBlock.onInitedPromise().then(async () => {
    let settings;
    let component = defineAsyncComponent(async () => {
        let [templateResp] = await Promise.all([
            axios({
                url: 'js/htmls/editorSettings/editorSettings.html',
                responseType: 'text'
            }),
        ]);
        return {
            name: 'editorSettings',
            template: templateResp.data,
            data() {
                return { enabled: true, settings }
            },
            watch: {
                enabled(v1, v2) {
                    if (!v1) {
                        OB_IDE.editorSettings.save();
                        OB_IDE.removeComponent(this);
                    }
                }
            },
            methods: {
            }
        }
    });
    OB_IDE.editorSettings = {
        settings,
        save() {
            OpenBlock.VFS.partition.config.put('editor.json', toRaw(settings));
        }
    };
    OB_IDE.addSiderBottomBotton({
        icon: 'md-settings',
        name: 'editorSettings',
        async onClick() {
            settings = await OpenBlock.VFS.partition.config.get('editor.json');
            if (!settings) {
                settings = window.webConfig.defaultEditorSettings || {
                    enabledUI: []
                };
            }
            OB_IDE.addComponent(component);
        }
    });
});