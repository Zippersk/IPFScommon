import IPFS from "typestub-ipfs";
import ipfsDefaultConfig from "./ipfsDefaultConfig"
import logger from '../logger';

export default class IPFSconnector {
    private static instance: IPFSconnector;
    private static config: object = ipfsDefaultConfig;
    private node: IPFS;

    static setConfig(config: object) {
        IPFSconnector.config = config
    }

    static async getInstanceAsync() {
        if (!IPFSconnector.instance) {
            IPFSconnector.instance = new IPFSconnector();
            const IPFSc = require('ipfs')

            IPFSconnector.instance.node = await IPFSc.create(IPFSconnector.config)
            logger.info("node started!")
        }
        return IPFSconnector.instance;
    }

    public getNode() {
        return this.node
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


