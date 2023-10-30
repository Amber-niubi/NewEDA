

import { defineAsyncComponent } from 'vue';
import SceneManager from '../../../core/ub/SceneManager.mjs';
export default defineAsyncComponent(() => {
    return new Promise((resolve, reject) => {
        axios({
            url: 'js/htmls/SceneManager/SceneIcon.html',
            responseType: 'text',
            async: false
        }).then(({ data }) => {
            resolve({
                name: 'SceneIcon',
                template: data,
                props: {
                    name: {
                        type: String,
                        required: true,
                    },
                    nameOf: {
                        type: String,
                        default: 'sceneId',
                        required: true,
                        validator: (value) => {
                            return ['sceneName', 'moduleName', 'sceneId'].includes(value)
                        }
                    },
                    size: {
                        type: [Number, String],
                        default: 14
                    }
                },
                data() {
                    return {
                        SceneManager
                    };
                },
                computed: {
                    title() {
                        let ss = this.scenes;
                        let lst = ss.map((s) => s.name);
                        let t = lst.join(',');
                        return t;
                    },
                    scenes() {
                        return this.SceneManager.scenes.filter(s => {
                            switch (this.nameOf) {
                                case 'sceneName':
                                    if (s.name == this.name) {
                                        return true;
                                    }
                                    break;
                                case 'moduleName':
                                    if (s.srcList.indexOf(this.name) >= 0) {
                                        return true;
                                    }
                                    break;
                                case 'sceneId':
                                    if (s.id == this.name) {
                                        return true;
                                    }
                                    break;
                            }
                        });
                    }
                }
            });
        });
    })
});