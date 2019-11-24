import IPFStype from "typestub-ipfs";
import ipfsDefaultConfig from "./ipfsDefaultConfig";
import logger from "../logger";
import IPFS from "ipfs";

export default class IPFSconnector {
    private static instance: IPFSconnector;
    private static config: object = ipfsDefaultConfig;
    private node: IPFStype;

    static setConfig(config: object) {
        IPFSconnector.config = config;
    }

    static async getInstanceAsync() {
        if (!IPFSconnector.instance) {
            IPFSconnector.instance = new IPFSconnector();

            IPFSconnector.instance.node = await IPFS.create(IPFSconnector.config);
            logger.info("node started!");
        }
        return IPFSconnector.instance;
    }

    public getNode() {
        return this.node;
    }

    public shutDown() {
        try {
            this.node.stop();
            logger.info("Node stopped!");
        } catch (error) {
            logger.error("Node failed to stop!", error);
        }
    }
}


