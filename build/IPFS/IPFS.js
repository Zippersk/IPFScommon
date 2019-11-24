"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const os = require('os');
class IPFSconnector {
    constructor() {
    }
    static getInstanceAsync() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!IPFSconnector.instance) {
                IPFSconnector.instance = new IPFSconnector();
                const IPFSc = require('ipfs');
                IPFSconnector.instance.node = yield IPFSc.create(ipfsConfig);
            }
            return IPFSconnector.instance;
        });
    }
    dagPutAsync(data) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.node.dag.put(data, {
                format: 297,
                hashAlg: 'sha2-256'
            });
        });
    }
    shutDown() {
        try {
            this.node.stop();
            console.log('Node stopped!');
        }
        catch (error) {
            console.error('Node failed to stop!', error);
        }
    }
}
exports.IPFSconnector = IPFSconnector;
const ipfsConfig = {
    repo: os.homedir() + '/.IPFSfeeder',
    config: {
        Addresses: {
            Swarm: [
                '/ip4/0.0.0.0/tcp/14012',
                '/ip4/127.0.0.1/tcp/14013/ws'
            ],
            API: '/ip4/127.0.0.1/tcp/5012',
            Gateway: '/ip4/127.0.0.1/tcp/9191'
        }
    },
    ipld: {
        formats: [require('../IPLD/formats'), require('ipld-dag-pb')]
    }
};
//# sourceMappingURL=IPFS.js.map