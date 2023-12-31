/**
 * @license
 * Copyright 2022 Du Tian Wei
 * SPDX-License-Identifier: Apache-2.0
 */
class VFSStorage {
    vfs;
    get(name, cb) {
        cb(null, name);
    }
    allFiles(cb) {
        cb([]);
    }
    putAll(nameContentPairArray) {
    }
    delete(name) { }
    deleteAll() { }

    async exist(name, cb) {
        if (cb) {
            cb(false);
        }
        return false;
    }
}
class VFSMemoryCache extends VFSStorage {
    datas = {};
    _storage;
    constructor(storage) {
        super();
        this._storage = storage;
    }
    get(name, cb) {
        // setTimeout(() => {
        if (!cb) {
            return new Promise((reslove) => {
                this.get(name, reslove);
            });
        }
        let v = this.datas[name];
        if (v) {
            cb(v, name);
        } else if (this._storage) {
            this._storage.get(name, v1 => {
                this.datas[name] = v1;
                cb(v1, name);
            });
        } else {
            cb(null, name);
        }
        // }, 0);
    }
    /**
     * 
     */
    putAll(nameContentPairArray) {
        nameContentPairArray.forEach(p => {
            this.datas[p.name] = p.content;
        });
        if (this._storage) {
            this._storage.putAll(nameContentPairArray);
        }
    }
    allFiles(cb) {
        let arr = [];
        for (let name in this.datas) {
            let content = this.datas[name];
            arr.push({ name, content })
        }
        cb(arr);
    }
    delete(name) {
        let v = this.datas[name];
        delete this.datas[name];
        if (this._storage) {
            this._storage.delete(name);
        }
        return v;
    }
    deleteAll() {
        this.datas = {};
        if (this._storage) {
            this._storage.deleteAll();
        }
    }
    async exist(name, cb) {
        let e = !!this.datas[name];
        if (cb) {
            cb(e);
        }
        return e;
    }
}



class VFS {
    static partition = {};
    /**
     * @type VFSStorage
     */
    _storage;

    /**
     * @type {object.<String,Function[]>}
     */
    callbacks = {};
    constructor(storage) {
        this._storage = storage;
        storage.vfs = this;
    }
    on(evt, callback) {
        let list = this.callbacks[evt];
        if (!list) {
            list = [];
            this.callbacks[evt] = list;
        }
        list.push(callback);
    }
    off(evt, callback) {
        let list = this.callbacks[evt];
        if (!list) {
            return;
        }
        let i = list.indexOf(callback);
        if (i >= 0) {
            list.splice(i, 1);
        }
    }
    trigger(evt, arg) {
        if (typeof (arg) == 'object') {
            arg.event = evt;
        }
        let list = this.callbacks[evt];
        if (list) {
            list.forEach((l) => {
                try {
                    l(arg);
                } catch (e) {
                    console.error(e);
                }
            });
        }
    }
    emit(evt, arg) {
        // setTimeout(() => {
        this.trigger(evt, arg);
        this.trigger('changed');
        // }, 0);
    }
    put(name, content) {
        this.putAll([{ name, content }]);
    }
    /**
     * 
     * @param {Map<name:String,content:file>[]} filemap 
     */
    putAll(filemap) {
        this._storage.putAll(filemap);
        this.emit('put', filemap);
    }
    delete(name) {
        let v = this._storage.delete(name);
        this.emit('delete', { name, content: v });
    }
    deleteAll() {
        this._storage.deleteAll();
        this.emit('deleteAll');
    }
    /**
     * 
     * @param {String} name 
     * @param {func(file:file,name:String)} cb 
     * 
     * @returns Promise<Wfile>
     */
    get(name, cb) {
        return this._storage.get(name, cb);
    }
    allFiles(cb) {
        this._storage.allFiles(cb);
    }
    async exist(name, cb) {
        return this._storage.exist(name, cb);
    }
}
VFS.VFSStorage = VFSStorage;
VFS.VFSMemoryCache = VFSMemoryCache;

VFS.partition.config = new VFS(new VFSMemoryCache());
VFS.partition.info = new VFS(new VFSMemoryCache());
VFS.partition.config.put('project.json', { name: '' });
VFS.partition.src = new VFS(new VFSMemoryCache());

window.OpenBlock.VFS = VFS;