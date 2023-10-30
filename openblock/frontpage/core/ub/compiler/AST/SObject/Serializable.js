/**
 * @license
 * Copyright 2021 Du Tian Wei
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * class T{}
 * Serializable(T);
 * let s = JSON.stringfy(new T());
 * let t = JSON.parse(s,Deserializer);
 * @param {} clazz 
 */
let Serializable = function (clazz) {
    clazz.prototype.toJSON = function () {
        this.$__type = this.__proto__.constructor.name;
        return this;
    }
    Serializable.SerializableClasses[clazz.name] = clazz;
};
Serializable.SerializableClasses = {};
let Deserializer = function (k, v) {
    if (v && v['$__type']) {
        let className = v['$__type'];
        let constructor = Serializable.SerializableClasses[className];
        if (!constructor) {
            return v;
        }
        let self = new constructor();
        delete v['$__type'];
        Object.assign(self, v);
        return self;
    }
    return v;
}