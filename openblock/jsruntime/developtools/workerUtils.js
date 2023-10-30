/**
 * @license
 * Copyright 2021 Du Tian Wei
 * SPDX-License-Identifier: Apache-2.0
 */

function replaceAll(text, map) {
    if (!text) {
        return '';
    }
    let regex_str = Object.keys(map).join('|');
    let regex = new RegExp(regex_str, 'g');
    return text.replace(regex, (match) => {
        return map[match];
    });
}