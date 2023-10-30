/**
 * @license
 * Copyright 2021 Du Tian Wei
 * SPDX-License-Identifier: Apache-2.0
 */
export default class Template {
    static replaceAll(text, map) {
        if (!text) {
            return '';
        }
        if (typeof (map) != 'object') {
            return text;
        }
        let regex_str = Object.keys(map).join('|');
        let regex = new RegExp(regex_str, 'g');
        return text.replace(regex, (match) => {
            return map[match];
        });
    }

    static parseTemplate(text, commentStart) {
        let parsed = {};
        let lines = text.split('\n');
        let state = null;
        let templateName;
        let templateContent;
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            let trimed = line.trim();
            switch (state) {
                case null:
                    if (trimed.startsWith(commentStart)
                        && trimed.endsWith('_START')
                        && trimed.substring(commentStart.length).trim().startsWith('TEMPLATE_')) {
                        let c = trimed.substring(commentStart.length).trim();
                        templateName = c.substring(0, c.length - 6);
                        templateContent = '';
                        state = 'template';
                    }
                    break;
                case 'template':
                    if (trimed.startsWith(commentStart) && trimed.endsWith(templateName + '_END')) {
                        parsed[templateName] = templateContent;
                        templateName = null;
                        state = null;
                    } else {
                        templateContent += '\n' + line;
                    }
                    break;
            }
        }
        return new Template(parsed, commentStart);
    }

    template;
    commentStart;
    debug = true;
    constructor(template, commentStart) {
        this.template = template;
        this.commentStart = commentStart;
    }
    buildContent(templateName, args) {
        let t = this.template[templateName];
        if (!t) {
            console.warn('no template:' + templateName);
            return ''
        }
        return this.debug ?
            '\n' + this.commentStart + ' ' + templateName + '\n' + Template.replaceAll(t, args)
            : Template.replaceAll(t, args);
    }
}
Serializable(Template);