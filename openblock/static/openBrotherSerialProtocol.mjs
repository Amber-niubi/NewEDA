/**
 * @license
 * Copyright 2021 Du Tian Wei
 * SPDX-License-Identifier: Apache-2.0
 */
function getCRC(data) {
    let a = 0xFFFF
    let b = 0xA001
    let tmp = 0
    for (var index in data) {
        let byte = data[index]
        a ^= byte
        for (var i = 0; i < 8; i++) {
            let last = a % 2
            a >>= 1
            if (last == 1) {
                a ^= b
            }
        }
    }
    tmp = a
    return [parseInt(tmp % 256), parseInt(tmp / 256)]
}
function delay(ms) {
    return new Promise(function (resolve) {
        setTimeout(resolve, ms);
    });
}
export default class OpenBrotherSerialProtocol {
    maxRetry = 5;
    blockSize = 64;
    port;
    reader;
    writer;
    buf = [];
    constructor(port) {
        this.port = port;
    }
    async open() {
        if (!this.port.writable) {
            await this.port.open({
                dataBits: 8, // 数据位
                stopBits: 1, // 停止位
                parity: "none", // 奇偶校验
                baudRate: 115200, // 波特率
            });
        }
        this.reader = this.port.readable.getReader();
        this.writer = this.port.writable.getWriter();
    }
    async close() {
        if (this.writer) {
            this.writer.releaseLock();
            this.writer = null;
        }
        if (this.reader) {
            this.reader.releaseLock();
            this.reader = null;
        }
        this.port.close();
    }
    async sendScript(script) {
        await this._resendScript();
        await this._askStartSendScript();
        console.log('board answered >>>');
        await this._checkFirmwareVersion();
        console.log('board answered something');
        await this._sendScript(script);
        console.log('script sent');
        await this._finishSending();
        console.log('finished');
    }
    async _sendScript(script) {
        const encoder = new TextEncoder();
        const encodedString = encoder.encode(script);
        const bytes = Array.from(encodedString);
        let id = 0;
        while (bytes.length > this.blockSize) {
            let sendBuf = bytes.splice(0, this.blockSize);
            let tried = 0;
            while (!await this._sendFilePart(sendBuf, id)) {
                tried++;
                if (tried > this.maxRetry) {
                    throw Error('maxRetry');
                }
            }
            id++;
        }
        await this._sendFilePart(bytes, id);
    }
    async _sendFilePart(bytes, id) {
        let byteslen = bytes.length + 11;
        let sendheader = [0xa5, 0x5a];
        let sendLength = [byteslen >> 16, byteslen & 0xFFFF];
        let sendCmd = [1];
        let sendID = [id >> 16, id & 0xFFFF];
        let sendContentLength = [bytes.length >> 16, bytes.length & 0xFFFF];
        let msg = sendheader.concat(sendLength, sendCmd, sendID, sendContentLength, bytes);
        let sendCRC = getCRC(msg);
        let msgWithCRC = msg.concat(sendCRC);
        const commandframe = new Uint8Array(msgWithCRC);
        await this.writer.write(commandframe);
        console.log('send:', id, msgWithCRC);
        let answer = [0xa5, 0x5a, 0, 8, 1, id >> 16, id & 0xFFFF];
        await this._readToBytes(answer);
        let succeed = await this._readLength(1);
        console.log('send:', id, succeed);
        return succeed == 0;
    }
    async _finishSending() {
        const bytes = [
            0xA5,
            0x5A,
            0x00,
            0x05,
            0x03,
        ];
        const commandframe = new Uint8Array(bytes);
        await this.writer.write(commandframe);
        await this._readToBytes(bytes);
    }
    async _resendScript() {
        const commandframe = new Uint8Array([
            0xA5,
            0x5A,
            0x00,
            0x05,
            0x03,
        ]);
        await this.writer.write(commandframe);
    }
    async _checkFirmwareVersion() {
        const bytes = [
            0xA5,
            0x5A,
            0x00,
            0x05,
            0x04,
        ];
        const commandframe = new Uint8Array(bytes);
        await this.writer.write(commandframe);
        await this._readToBytes([
            0xA5,
            0x5A,
            0x00,
            0x09,
            0x04,
        ]);
        let version = await this._readLength(4);
        console.log(version);
    }
    async _askStartSendScript() {
        const commandframe = new Uint8Array([
            0xA5,
            0x5A,
            0x04,
            0x00,
            0x00,
        ]);
        await this.writer.write(commandframe);
        await this._readTo('>>>');
    }
    async _readLength(len, timeout) {
        if (!timeout) {
            timeout = 5000;
        }
        if (this.buf.length >= len) {
            return this.buf.splice(0, len);
        }
        while (true) {
            let value, done;
            const readPromise = this.reader.read().then((data) => {
                value = data.value;
                done = data.done;
            });
            await Promise.race([readPromise, delay(timeout)]);
            if (!value) {
                throw Error('Timeout');
            }
            console.warn(value);
            this.buf = this.buf.concat(Array.from(value));
            if (this.buf.length >= len) {
                return this.buf.splice(0, len);
            }
            if (done) {
                throw Error('ConnectionLost');
            }
        }
    }
    _searchSubArray(buf, bytes, start) {
        if (start < 0) {
            start = 0;
        }
        if (bytes.length > buf.length - start) {
            return -1;
        }
        let i = buf.length - bytes.length + 1;
        L1: while (i >= start) {
            i--;
            for (let j = 0; j < bytes.length; j++) {
                if (buf[i + j] != bytes[j]) {
                    continue L1;
                }
            }
            return i;
        }
        return -1;
    }
    async _readToBytes(bytes, timeout) {
        if (!timeout) {
            timeout = 5000;
        }
        console.log('wait for ', bytes);
        while (true) {
            let value, done;
            const readPromise = this.reader.read().then((data) => {
                value = data.value;
                done = data.done;
            });
            await Promise.race([readPromise, delay(timeout)]);
            if (!value) {
                console.error('Timeout');
                throw Error('Timeout');
            }
            console.warn(value);
            let start = this.buf.length - bytes.length;
            this.buf = this.buf.concat(Array.from(value));
            let pos = this._searchSubArray(this.buf, bytes, start);
            if (pos >= 0) {
                this.buf.splice(0, pos + bytes.length);
                return;
            }
        }
    }
    async _readTo(targetText, timeout) {
        const encoder = new TextEncoder();
        const encodedString = encoder.encode(targetText);
        const bytes = Array.from(encodedString);
        return await this._readToBytes(bytes, timeout);
    }
}