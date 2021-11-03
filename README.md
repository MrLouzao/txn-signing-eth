## Requirements

- Node v16 (tested under v16.5.0)
- Npx installed v7.19.1

It's recommended to use NVM for virtual environments in node.

## How to execute this

This repo uses babel, so you need to execute npm with babel.

npx babel-node app.js

## Bundling and installing

We can generate a backwards compatible module by calling Babel and
transpiling to ES5.

npx babel txnSign.js --out-file build/bundle-txnSign.js
npx babel app-songbird.js --out-file build/bundle.js

Now we can execute the file in an old version. We are going to try
it on v8.17.0 for Node.

nvm use 8.17.0
node bundle.js


## How to sign transactions EIP-1552

1. In bundle-txnSign.js change the nonce to the next value. Remember that is an autoincremental value. This value should be an hexadecimal string.

2. Compile the script:

npx babel app.js --out-file bundle.js

3. Execute the script:

node bundle.js

4. On the output of the terminal copy the raw tx hexadecimal string and use it to send to a node. Use a node with the operation eth_sendRawTransaction.

5. To finish, ctrl+c to stop the script

## How to execute for songbird

1. Modify data to provide in the txn in app-songbird.js file line 26

Also set the secret to sign


2. Compile:  npm run compile-songbird

3. Exec:  npm run exec-songbird


Now send the generated raw to the node:

```
curl --location --request POST 'http://localhost:9650/ext/bc/C/rpc' \
--header 'Content-Type: application/json' \
--data-raw '{
    "jsonrpc":"2.0",
    "id"     :1,
    "method" :"eth_sendRawTransaction",
    "params" : ["0x01f86a1001853b9aca00008253fc94ffc11262622d5069abad729efe84a95c169d9c06808460806040c001a0d8ca7eb6dd99a81ae88dbe9fb95298e6fdaef545a12bebdcf05de3f3e0a76303a03a313d00e65215ceb2e0dc50d1203dd22538f7f54a08353d7efb6edf053d74dd"]
}'
```
