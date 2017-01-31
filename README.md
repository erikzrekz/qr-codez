# QR Codes and IPFS

Create QR Codes and put them on IPFS

## Prereqs

- IPFS daemon: Learn how to do that [here](https://ipfs.io/docs/install/).
- node.js v7.3.0


### Install
1. npm install
2. npm start

### Package Dependencies
```
  "dependencies": {
    "async": "2.1.4",
    "body-parser": "1.16.0",
    "express": "4.1.1",
    "ipfs": "0.21.4",
    "pug": "2.0.0-beta9"
  }
```

### Successful Startup Output
```
> qr_codez@0.0.1 start /Users/eriks/dev/qr-codez
> node app.js

 
==== IPFS ====
Version: 0.21.4
Peer ID: QmVK3wHXWxrVzPS5CpyRdtxWNHRB9QrgmNkB2NisHL8PyE
Swarm listening on /ip4/127.0.0.1/tcp/4002
Swarm listening on /ip4/000.000.0.0/tcp/4002
Swarm listening on /ip4/000.000.00.0/tcp/4002
Successfully connected to IPFS
==============
```