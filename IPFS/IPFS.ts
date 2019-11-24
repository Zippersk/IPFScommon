import IPFS from "typestub-ipfs";
const os = require('os')

export class IPFSconnector {
    private static instance: IPFSconnector;
    private node: IPFS;
    private constructor() { 
        // do something construct...
    }
    static async getInstanceAsync() {
        if (!IPFSconnector.instance) {
            IPFSconnector.instance = new IPFSconnector();
            const IPFSc = require('ipfs')

            IPFSconnector.instance.node = await IPFSc.create(ipfsConfig)
        }
        return IPFSconnector.instance;
    }

    public async dagPutAsync(data: any) {
        return await this.node.dag.put(data, {
            format: 297,
            hashAlg: 'sha2-256'
        })
    }

    public shutDown() {
        try {
            this.node.stop()
            console.log('Node stopped!')
        } catch (error) {
            console.error('Node failed to stop!', error)
        }
    }
}


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
        formats: [ require('../IPLD/formats'), require('ipld-dag-pb')]
    }
}