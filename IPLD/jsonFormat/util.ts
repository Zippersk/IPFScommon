'use strict'


const CID = require('cids')
const multicodec = require('multicodec')
const multihashes = require('multihashes')
const multihashing = require('multihashing-async')
const transform = require('lodash.transform')
const isCircular = require('is-circular')
const json = require('fast-json-stable-stringify')


const CODEC = 297
const DEFAULT_HASH_ALG = multicodec.DBL_SHA2_256

let _serialize = obj => transform(obj, (result, value, key) => {
  if (CID.isCID(value)) {
    result[key] = { '/': value.toBaseEncodedString() }
  } else if (Buffer.isBuffer(value)) {
    result[key] = { '/': { base64: value.toString('base64') } }
  } else if (typeof value === 'object' && value !== null) {
    result[key] = _serialize(value)
  } else {
    result[key] = value
  }
})


/**
 * Serialize internal representation into a binary Bitcoin block.
 *
 * @param {BitcoinBlock} dagNode - Internal representation of a Bitcoin block
 * @returns {Buffer}
 */
const serialize = (obj) =>  {
  if (isCircular(obj)) {
    throw new Error('Object contains circular references.')
  }

  let data = _serialize(obj)
  return Buffer.from(json(data))
}


let _deserialize = obj => transform(obj, (result, value, key) => {
  if (typeof value === 'object' && value !== null) {
    if (value['/']) {
      if (typeof value['/'] === 'string') result[key] = new CID(value['/'])
      else if (typeof value['/'] === 'object' && value['/'].base64) {
        result[key] = Buffer.from(value['/'].base64, 'base64')
      } else result[key] = _deserialize(value)
    } else {
      result[key] = _deserialize(value)
    }
  } else {
    result[key] = value
  }
})

/**
 * Deserialize Bitcoin block into the internal representation.
 *
 * @param {Buffer} binaryBlob - Binary representation of a Bitcoin block
 * @returns {BitcoinBlock}
 */
const deserialize = (buffer) => {
  let obj = JSON.parse(buffer.toString())
  let deserializedObject = _deserialize({ value: obj }).value

  deserializedObject.toJSON = () => deserializedObject

  return deserializedObject
}

/**
 * Calculate the CID of the binary blob.
 *
 * @param {Object} buffer - Encoded IPLD Node
 * @param {Object} [userOptions] - Options to create the CID
 * @param {number} [userOptions.cidVersion=1] - CID version number
 * @param {string} [UserOptions.hashAlg] - Defaults to the defaultHashAlg of the format
 * @returns {Promise.<CID>}
 */
const cid = async (buffer) => {
  let hash = JSON.parse(buffer.toString()).hash
  return hashToCid(hash)
}


const hashToCid = (hash) => {
  const multihash = multihashes.encode(Buffer.from(hash), DEFAULT_HASH_ALG)
  const cidVersion = 1
  const codecName = 'dag-json'
  return new CID(cidVersion, codecName, multihash)
}

module.exports = {
  hashToCid: hashToCid,
  codec: CODEC,
  defaultHashAlg: DEFAULT_HASH_ALG,

  // Public API
  cid: cid,
  deserialize: deserialize,
  serialize: serialize
}
