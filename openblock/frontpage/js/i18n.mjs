
import zh_CN from '../3rd/view-ui-plus@1.3.14/dist/locale/zh-CN.js';
import en_US from '../3rd/view-ui-plus@1.3.14/dist/locale/en-US.js';
import * as VueI18n from 'vue-i18n';
export default {
    install(app) {
        app.config.unwrapInjectedRef = true;
        let messages = {};
        messages['zh-CN'] = zh_CN;
        messages['zh-hans'] = messages['zh-CN'];
        messages['zh-Hans'] = messages['zh-CN'];
        messages['en-US'] = en_US;
        let i18n = VueI18n.createI18n({
            locale: 'zh-Hans',
            allowComposition: true,
            globalInjection: true,
            // legacy: false,
            // fallbackLocale: 'zh-Hans',
            messages
        });
        app.use(i18n);
        app.config.globalProperties.i18n = i18n;
        // let ot = app.config.globalProperties.$t;
        // app.config.globalProperties.$t = (msg) => {
        //     let t = ot(msg);
        //     return t || msg;
        // };
        OpenBlock.onInited(() => {
            let l = OpenBlock.language;
            if (i18n.mode == "legacy") {
                i18n.global.locale = l;
            } else {
                i18n.global.locale.value = l;
            }
            let m = messages[l];
            if (!m) {
                m = {};
                messages[l] = m;
            }
            Object.assign(m, Blockly.Msg, OpenBlock.I18N);
        });
    }
}