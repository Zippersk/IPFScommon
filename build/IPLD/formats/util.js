'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const CID = require('cids');
const multicodec = require('multicodec');
const multihashes = require('multihashes');
const multihashing = require('multihashing-async');
const transform = require('lodash.transform');
const isCircular = require('is-circular');
const json = require('fast-json-stable-stringify');
const CODEC = 297;
const DEFAULT_HASH_ALG = multicodec.DBL_SHA2_256;
let _serialize = obj => transform(obj, (result, value, key) => {
    if (CID.isCID(value)) {
        result[key] = { '/': value.toBaseEncodedString() };
    }
    else if (Buffer.isBuffer(value)) {
        result[key] = { '/': { base64: value.toString('base64') } };
    }
    else if (typeof value === 'object' && value !== null) {
        result[key] = _serialize(value);
    }
    else {
        result[key] = value;
    }
});
const serialize = (obj) => {
    if (isCircular(obj)) {
        throw new Error('Object contains circular references.');
    }
    let data = _serialize(obj);
    return Buffer.from(json(data));
};
let _deserialize = obj => transform(obj, (result, value, key) => {
    if (typeof value === 'object' && value !== null) {
        if (value['/']) {
            if (typeof value['/'] === 'string')
                result[key] = new CID(value['/']);
            else if (typeof value['/'] === 'object' && value['/'].base64) {
                result[key] = Buffer.from(value['/'].base64, 'base64');
            }
            else
                result[key] = _deserialize(value);
        }
        else {
            result[key] = _deserialize(value);
        }
    }
    else {
        result[key] = value;
    }
});
const deserialize = (buffer) => {
    let obj = JSON.parse(buffer.toString());
    let deserializedObject = _deserialize({ value: obj }).value;
    deserializedObject.toJSON = () => deserializedObject;
    return deserializedObject;
};
const cid = (buffer) => __awaiter(void 0, void 0, void 0, function* () {
    let hash = JSON.parse(buffer.toString()).hash;
    return hashToCid(hash);
});
const hashToCid = (hash) => {
    const multihash = multihashes.encode(Buffer.from(hash), DEFAULT_HASH_ALG);
    const cidVersion = 1;
    const codecName = 'dag-json';
    return new CID(cidVersion, codecName, multihash);
};
module.exports = {
    hashToCid: hashToCid,
    codec: CODEC,
    defaultHashAlg: DEFAULT_HASH_ALG,
    cid: cid,
    deserialize: deserialize,
    serialize: serialize
};
//# sourceMappingURL=util.js.map