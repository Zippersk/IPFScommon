import IPFSconnector from "./IPFSConnector";


export default abstract class DAG {

    private static async getNodeAsync() {
        return (await IPFSconnector.getInstanceAsync()).node;
    }

    public static async PutAsync(data: any) {
        const node = await DAG.getNodeAsync();
        const cid = await node.dag.put(data, { format: "dag-cbor", hashAlg: "sha3-512" });
        return cid;
    }

    public static async Get(cid: string, path: string) {
        const node = await DAG.getNodeAsync();
        const result = await node.dag.get(cid, path);
        return result.value;
    }

    public static async GetByHashAsync(hash: string, path: string) {
        const index =  await this.Get("bafyriqdjesjircvsthtk4kavycqngapporlmopbel3ghb4hvkh3xqw2mixy3qva2b7246pnzddz2my4oivl5lkhq7zacmgsmq7bcobjlgd3ku", hash);
        const result = await this.Get(index, path);
        return result.value;
    }
}
