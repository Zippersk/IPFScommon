import cbor from "ipld-dag-cbor";
import multicodec from "multicodec";
import multihashing from "multihashing-async";
import CID from "cids";
import logger from "../logger";

const customCbor = cbor;
const codec = multicodec.DAG_CBOR
const defaultHashAlg = multicodec.SHA2_256

const hashToCid = async (hash: string, userOptions) => {
  logger.info("calculating cid for " + hash);
  const defaultOptions = { cidVersion: 1, hashAlg: defaultHashAlg };
  const options = Object.assign(defaultOptions, userOptions);
  const multihash = await multihashing(Buffer.from(hash), options.hashAlg);
  const codecName = multicodec.print[codec];
  const cid = new CID(options.cidVersion, codecName, multihash);
  return cid;
};

/**
 * Calculate the CID of the binary blob.
 *
 * @param {Object} binaryBlob - Encoded IPLD Node
 * @param {Object} [userOptions] - Options to create the CID
 * @param {number} [userOptions.cidVersion=1] - CID version number
 * @param {string} [UserOptions.hashAlg] - Defaults to the defaultHashAlg of the format
 * @returns {Promise.<CID>}
 */
customCbor.util.cid = async (binaryBlob, userOptions) => {
    const hash = cbor.util.deserialize(binaryBlob).hash;
    const cid = hashToCid(hash, userOptions);
    return cid;
  };


export default customCbor;