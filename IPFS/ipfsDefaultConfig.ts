const os = require('os')

export default {
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
        formats: [ require('../IPLD/jsonFormat'), require('ipld-dag-pb')]
    }
}