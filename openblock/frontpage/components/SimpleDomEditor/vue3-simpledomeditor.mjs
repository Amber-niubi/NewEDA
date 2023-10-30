
import { defineComponent, h, resolveComponent, cloneVNode, markRaw } from 'vue';
export let DynamicComponent = defineComponent({
    props: { 'name': { type: String, name: 'name' } },
    data() {
        return {};
    },
    render() {
        return [h(this.name, { 'data-dynamic': 'true' }, this.$slots)];
    }
});
export let DynamicComponentGroup = defineComponent({
    props: {
        'group': {
            type: Object
        }
    },
    data() {
        return {};
    },
    methods: {
        r_slot(slot) {
            if (Array.isArray(slot)) {
                return this.r_group(slot);
            } else if (typeof (slot) == 'object') {
                return this.r_groupChild(slot);
            } else {
                return slot;
            }
        },
        r_groupChild(item) {
            if (typeof (item) == 'string') {
                return item;
            }
            let comp = resolveComponent(item.type);
            let slot = this.r_slot(item.slot);
            return h(comp, item.props, slot);
        },
        r_group(group) {
            if (Array.isArray(group)) {
                let g = group.map(child => {
                    return this.r_groupChild(child);
                });
                return g;
            }
        }
    },
    render() {
        let r = h('div', { ref: 'comp', 'data-editable': 'container' }, this.r_group(this.group));
        return r;
    }
});
export let DynamicComponentEditor = defineComponent({
    props: {
        editable: { type: Boolean }, maskColor: { type: String },
        group: {
            type: Object
        }
    },
    data() {
        return {
            componentMap: markRaw({ map: new Map() }),
            selectedComponent: null,
            selectedElement: null,
            startX: 0, startY: 0,
            moving: false,
        }
    },
    methods: {
        r_edit_rect(dycmp) {
            if (dycmp) {
                let rect = dycmp.getBoundingClientRect();
                let rectR = this.$refs.comp.getBoundingClientRect();
                return h('div', {
                    class: 'selectedDynamicComponent',
                    ref: 'selectRect',
                    style: {
                        'position': 'absolute',
                        'border': '1px solid black',
                        'left': rect.x - rectR.x + 'px',
                        'top': rect.y - rectR.y + 'px',
                        'width': rect.width + 'px',
                        'height': rect.height + 'px',
                        // 'position': 'fixed',
                        'z-index': 199999999999
                    },
                    draggable: true,
                    'onClick.stop.prevent': this.onRectClick,
                    onDrag: this.onRectDrag,
                    onMousedown: this.onRectMousedown,
                    // onMousemove: this.onRectMousemove,
                    'onMouseup.stop.prevent': this.onRectMouseup,
                });
            }
        },
        onRectMouseup(event) {
            console.log(event);
            this.moving = false;
            let selectRect = this.$refs.selectRect;
            selectRect.style.cursor = "auto";
            let rect = selectRect.getBoundingClientRect();
            let selectedComponent = this.selectedComponent;
            selectedComponent.style.left = rect.left;
            selectedComponent.style.top = rect.top;
        },
        onMouseup(event) {
            // console.log(event);
            if (!this.moving) {
                return;
            }
            this.moving = false;
            let selectRect = this.$refs.selectRect;
            if (selectRect) {
                selectRect.style.cursor = "auto";
                selectRect = selectRect.getBoundingClientRect();

                let rangeRect = this.$refs.comp.getBoundingClientRect();

                let selectedComponent = this.selectedComponent;
                let id = selectedComponent.id;
                let data = this.componentMap.map.get(id);
                if (data && data.props && data.props.style) {
                    if (selectRect.left < rangeRect.left) {
                        this.selectedComponent = null;
                        this.selectedElement = null;
                        return;
                    }
                    if (selectRect.right > rangeRect.right) {
                        this.selectedComponent = null;
                        this.selectedElement = null;
                        return;
                    }
                    if (selectRect.top < rangeRect.top) {
                        this.selectedComponent = null;
                        this.selectedElement = null;
                        return;
                    }
                    if (selectRect.bottom > rangeRect.bottom) {
                        this.selectedComponent = null;
                        this.selectedElement = null;
                        return;
                    }
                    data.props.style.left = selectRect.left - rangeRect.left + 'px';
                    data.props.style.top = selectRect.top - rangeRect.top + 'px';
                }
            }
        },
        onMousemove(event) {
            if (!this.moving) {
                return;
            }
            var x = event.clientX - this.startX;
            var y = event.clientY - this.startY;

            let selectRect = this.$refs.selectRect;
            selectRect.style.left = x + "px";
            selectRect.style.top = y + "px";
        },
        onRectMousedown(e) {
            console.log(e);
            this.moving = true;
            let selectRect = this.$refs.selectRect;
            selectRect.style.cursor = "grabbing";
            selectRect.style.userSelect = "none";
            this.startX = e.clientX - selectRect.offsetLeft;
            this.startY = e.clientY - selectRect.offsetTop;
        },
        onRectDrag(e) {
            // console.log(e);
            var dt = e.dataTransfer;
            dt.setData("application/simpleDomEditorComponent", "");
        },
        dragOverEditor(e) {
            console.log(e);
        },
        getDyCmp(children, x, y) {
            for (let i = 0; i < children.length; i++) {
                let child = children[i];
                if (child.dataset.editable) {
                    if (child.dataset.editable == 'container') {
                        let subChild = this.getDyCmp(child.children, x, y);
                        if (subChild) {
                            return subChild;
                        }

                        let rect = child.getBoundingClientRect();
                        if (rect.left < x && rect.left + rect.width > x) {
                            if (rect.top < y && rect.top + rect.height > y) {
                                return child;
                            }
                        }
                    } else if (child.dataset.editable == 'true') {
                        let rect = child.getBoundingClientRect();
                        if (rect.left < x && rect.left + rect.width > x) {
                            if (rect.top < y && rect.top + rect.height > y) {
                                return child;
                            }
                        }
                    }
                }
            }
        },
        onRectClick(e) {
            console.log(e.x, e.y)
            e.preventDefault();
        },
        onClick(e) {
            let comp = this.$refs.comp;
            let children = comp.children;
            let dycmp = this.getDyCmp(children, e.x, e.y);
            this.selectedComponent = dycmp;
            if (dycmp) {
                let elem = document.getElementById(dycmp.id);
                this.selectedElement = elem;
            } else {
                this.selectedElement = null;
            }
        },
        r_slot(slot) {
            if (Array.isArray(slot)) {
                return this.r_group(slot);
            } else if (typeof (slot) == 'object') {
                if (slot.props && slot.props.id) {
                    this.componentMap.map.set(slot.props.id, slot);
                }
                return this.r_groupChild(slot);
            } else {
                return slot;
            }
        },
        r_groupChild(item) {
            if (typeof (item) == 'string') {
                return item;
            }
            if (item.props && item.props.id) {
                this.componentMap.map.set(item.props.id, item);
            }
            let comp = resolveComponent(item.type);
            let slot = this.r_slot(item.slot);
            return h(comp, item.props, slot);
        },
        r_group(group) {
            if (Array.isArray(group)) {
                let g = group.map(child => {
                    return this.r_groupChild(child);
                });
                return g;
            }
            if (group.props && group.props.id) {
                this.componentMap.map.set(group.props.id, group);
            }
        }
    },
    render() {
        if (!this.editable) {
            let r = h('div', { ref: 'comp', 'data-editable': 'container', style: { width: '100%', height: '100%' } }, this.r_group(this.group));
            return r;
            // return h('div', { ref: 'comp' }, this.$slots);
        } else {
            this.componentMap.map.clear();
            let rect = this.$refs.comp.getBoundingClientRect();
            let r = h('div', { style: { 'position': 'absolute', width: '100%', height: '100%' } }, [
                h('div', { ref: 'comp', 'data-editable': 'container', style: { 'position': 'absolute', width: '100%', height: '100%' } }, this.r_group(this.group)),
                h('div', {
                    ref: 'editor',
                    onDragOver: this.dragOverEditor,
                    'onClick': this.onClick,
                    style: {
                        'position': 'absolute',
                        'top': 0, 'left': 0, 'width': rect.width + 'px', 'height': rect.height + 'px',
                        'background-color': this.maskColor,
                        'z-index': 99999999999,
                    },
                    onMousemove: this.onMousemove,
                    onMouseup: this.onMouseup
                }, this.r_edit_rect(this.selectedComponent))
            ]);
            return r;
        }
    }
});
// export default { DynamicComponent }