"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cids_1 = require("cids");
const util = require('./util');
exports.resolve = (binaryBlob, path) => {
    let node = util.deserialize(binaryBlob);
    const parts = path.split('/').filter(Boolean);
    while (parts.length) {
        const key = parts.shift();
        if (node[key] === undefined) {
            throw new Error(`Object has no property '${key}'`);
        }
        node = node[key];
        if (cids_1.default.isCID(node)) {
            return {
                value: node,
                remainderPath: parts.join('/')
            };
        }
    }
    return {
        value: node,
        remainderPath: ''
    };
};
const traverse = function* (node, path) {
    if (Buffer.isBuffer(node) || cids_1.default.isCID(node) || typeof node === 'string' ||
        node === null) {
        return;
    }
    for (const item of Object.keys(node)) {
        const nextpath = path === undefined ? item : path + '/' + item;
        yield nextpath;
        yield* traverse(node[item], nextpath);
    }
};
exports.tree = function* (binaryBlob) {
    const node = util.deserialize(binaryBlob);
    yield* traverse(node, undefined);
};
//# sourceMappingURL=resolver.js.map