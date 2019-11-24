import os from "os";
import fs from "fs";
import Protector from "libp2p-pnet";

const swarmKeyPath = "../swarm.key";

export default {
    repo: os.homedir() + "/.ipfs",
    config: {
      Addresses: {
        Swarm: [
          "/ip4/0.0.0.0/tcp/4012",
          "/ip4/127.0.0.1/tcp/4013/ws"
        ],
        API: "/ip4/127.0.0.1/tcp/5012",
        Gateway: "/ip4/127.0.0.1/tcp/9191"
      }
    },
    ipld: {
        formats: [ require("../IPLD/jsonFormat"), require("ipld-dag-pb")] // TODO: rewrite as imports
    },
    libp2p: {
      modules: {
        connProtector: new Protector(fs.readFileSync(swarmKeyPath))
      }
    }
};