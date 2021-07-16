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

npx babel.js --out-file bundle.js

Now we can execute the file in an old version. We are going to try
it on v8.17.0 for Node.

nvm use 8.17.0
node bundle.js