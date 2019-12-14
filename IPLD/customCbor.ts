import cbor from "ipld-dag-cbor";
import multicodec from "multicodec";
import multihashing from "multihashing-async";
import CID from "cids";
import logger from "../logger";

/**
 * Calculate the CID of the binary blob.
 *
 * @param {Object} binaryBlob - Encoded IPLD Node
 * @param {Object} [userOptions] - Options to create the CID
 * @param {number} [userOptions.cidVersion=1] - CID version number
 * @param {string} [UserOptions.hashAlg] - Defaults to the defaultHashAlg of the format
 * @returns {Promise.<CID>}
 */
cbor.cid = async (binaryBlob, userOptions) => {
    const defaultOptions = { cidVersion: 1, hashAlg: exports.defaultHashAlg };
    const options = Object.assign(defaultOptions, userOptions);
  
    const multihash = await multihashing(binaryBlob, options.hashAlg);
    const codecName = multicodec.print[exports.codec];
    const cid = new CID(options.cidVersion, codecName, multihash);
    logger.info("calculating CID");
    return cid;
  };


export default cbor;