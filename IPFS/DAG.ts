import IPFSconnector from "./IPFSConnector";
import cbor from "../IPLD/customCbor";


export default abstract class DAG {

    private static async getNodeAsync() {
        return (await IPFSconnector.getInstanceAsync()).getNode();
    }

    public static async PutAsync(data: any) {
        const node = await DAG.getNodeAsync();
        const cid = await node.dag.put(data, { format: "dag-cbor", hashAlg: "sha3-512" });
        return cid;
    }

    public static async GetByHashAsync(hash: string, path: string) {
        const node = await DAG.getNodeAsync();
        const result = await node.dag.get(cbor.hashToCid(hash), path);
        return result;
    }
}