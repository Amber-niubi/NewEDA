
import { h, defineAsyncComponent } from 'vue';
let UIBuilderRT = defineAsyncComponent(async () => {
    return {
        props: { page: { type: Object } },
        render() {
            if (this.page) {
                return h('div', {}, [h('span', {}, ['data'])]);
            } else {
                return h('div', {}, [h('span', {}, ['Empty'])]);
            }
        },
        data() {
            return {
            };
        }
    };
});
export default UIBuilderRT;