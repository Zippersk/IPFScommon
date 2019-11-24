exports.Crypto = require('./Crypto')
exports.IPFS = require('./IPFS/IPFS')
exports.IPLDformat = require('./IPLD/jsonFormat')



async function runAsync() {
    var ipfsInstance = await exports.IPFS.IPFSconnector.getInstanceAsync()
}

runAsync()
    .then(() => {
        console.log("done");
    })
    .catch((e) => {
        throw e;
    })

