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

npx babel txnSign.js --out-file bundle-txnSign.js
npx babel app.js --out-file bundle.js

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

