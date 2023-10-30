/**
 * @license
 * Copyright 2022 Du Tian Wei
 * SPDX-License-Identifier: Apache-2.0
 */

import Logic from '../logic/logic.mjs'
import { defineAsyncComponent } from 'vue';
export default defineAsyncComponent(async () => {
    let [templateResp] = await Promise.all([
        axios({
            url: 'js/htmls/errorpanel/errorpanel.html',
            responseType: 'text'
        }),
        OpenBlock.onInitedPromise()
    ]);
    return {
        data() {
            return {
                showErrorWindow: false,
                errors: []
            }
        },
        template: templateResp.data,
        computed: {
        },
        methods: {
            highlightErrBlock(err) {
                Logic.instance.highlightErrBlock(err);
            },
            update() {
                let errors = [];
                OpenBlock.BlocklyParser.loadedFiles.srcs.forEach(src => {
                    if (src._errors) {
                        src._errors.forEach(err => {
                            errors.push({
                                src, err
                            });
                        });
                    }
                    if (src.__compiled && src.__compiled.errors) {
                        src.__compiled.errors.forEach(err => { errors.push({ src, err }) });
                    }
                });
                this.errors = errors;
            }
        },
        mounted() {
            setInterval(this.update.bind(this), 1500);
        }
    }
});