import IPFSconnector from './IPFSConnector'
import {hashToCid} from '../IPLD/jsonFormat/util'


export default abstract class DAG {

    private static async getNodeAsync() {
        return (await IPFSconnector.getInstanceAsync()).getNode()
    }

    public static async PutAsync(data: any) {
        let node = await DAG.getNodeAsync()
        return await node.dag.put(data, {
            format: 297,
            hashAlg: 'sha2-256'
        })
    }

    public static async GetAsync(hash: string, path: string) {
        let node = await DAG.getNodeAsync()
        let CID = hashToCid(hash)
        return await node.dag.get(CID)
    }
}