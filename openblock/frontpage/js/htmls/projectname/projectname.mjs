import { defineComponent } from 'vue';
const template = `
<div style="text-align:center;position:absolute;top:0;height:32px;right:15%;">
<input v-if="editProjectName"
    class="ProjectName" autofocus v-model="projectName"
    @blur="updateProjectName" @keypress="updateProjectNameKeypress" />
<a v-else-if="projectName"
    class="ProjectName"
    @click="doEditProjectName">{{projectName}}
</a>
<a v-else
    class="ProjectName"
    @click="doEditProjectName">{{$t("未命名")}}</a>
<a id="projectthumbnail" onclick="return false">
    <img v-if="imgBase64" :src="'data:image/png;base64, '+imgBase64" />
</a>
</div>
`
export default defineComponent({
    template,
    data() {
        return {
            editProjectName: false,
            projectName: '',
            imgBase64: null
        }
    },
    mounted() {
        OpenBlock.onInited(() => {
            let that = this;
            function updateUI() {
                VFS.partition.config.get('project.json', (proj) => {
                    if (proj) {
                        that.projectName = proj.name;
                        that.imgBase64 = proj.thumbnail;
                    } else {
                        that.projectName = '';
                        that.imgBase64 = null;
                    }
                });
                VFS.partition.info.get('thumbnail.jpg', (imgArrayBuffer) => {
                    if (imgArrayBuffer) {
                        that.imgBase64 = OpenBlock.Utils.arrayBufferToBase64(imgArrayBuffer);
                    } else {
                        that.imgBase64 = null;
                    }
                });
            }
            VFS.partition.config.on('changed', updateUI);
            VFS.partition.info.on('changed', updateUI);
            updateUI();
        });
    },
    methods: {
        doEditProjectName() {
            this.editProjectName = true;
        },
        updateProjectNameKeypress(e) {
            if (e.code === "Enter") {
                this.updateProjectName();
            } else if (e.code === 'Escape') {
                VFS.partition.config.get('project.json', (proj) => {
                    if (proj && proj.name !== this.projectName) {
                        this.projectName = proj.name;
                    }
                });
                this.editProjectName = false;
            }
        },
        updateProjectName() {
            VFS.partition.config.get('project.json', (proj) => {
                if (proj && proj.name !== this.projectName) {
                    proj.name = this.projectName;
                    VFS.partition.config.put('project.json', proj);
                }
            });
            this.editProjectName = false;
        },
    }
})