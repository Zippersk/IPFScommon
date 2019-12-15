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
        const node = await DAG.getNodeAsync();

        const index =  await this.Get("bafyriqecmz35zju2eaa635yevqvmwptxqko4au7eaw2ksw7oeen2il3k2g7upvq3d2zypmmvgdlgn22wupixqzk3hea2keanwjlfpcwi3czak", hash);
        const result = await this.Get(index, path);
        return result.value;
    }
}
