import IPFS from "typestub-ipfs";
import ipfsDefaultConfig from "./ipfsDefaultConfig"
import logger from '../logger';

export class IPFSconnector {
    private static instance: IPFSconnector;
    private static config: object = ipfsDefaultConfig;
    private node: IPFS;

    static async getInstanceAsync() {
        if (!IPFSconnector.instance) {
            IPFSconnector.instance = new IPFSconnector();
            const IPFSc = require('ipfs')

            IPFSconnector.instance.node = await IPFSc.create(IPFSconnector.config)
            logger.info("node started!")
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
            logger.info('Node stopped!')
        } catch (error) {
            logger.error('Node failed to stop!', error)
        }
    }
}


