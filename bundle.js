"use strict";

var _ethereumjsWallet = _interopRequireDefault(require("ethereumjs-wallet"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Key and wallet generation - global variables
var privateKey = Buffer.from('c4f0b1136d4a1f4c6db53994a0d1d9a9fd38c0a75a5dd89130b782af80441272', 'hex');

var userWallet = _ethereumjsWallet["default"].fromPrivateKey(privateKey);

var publicKey = userWallet.getPublicKeyString();
var address = userWallet.getAddressString();
console.log('private key: ' + userWallet.getPrivateKeyString());
console.log('public key: ' + publicKey);
console.log('address: ' + address); // TODO create an express server that exposes an endpoint for executing signatures
//  - Only sign in case of being connected to the network
// Behaviour here is intended to simulate the TODO behaviour
// Only sign transactions if the network is offline

var subscribe = require('./checkConnection');

var isNetworkConnected = false;
subscribe(function (isConnected) {
  var isConn = isConnected ? "connected" : "disconnected";
  console.log("Network status change::" + isConn);
  isNetworkConnected = isConnected;
}); // Simulate offline transaction

var txnSign = require('./bundle-txnSign');

var txnExecuted = false;
setInterval(function () {
  if (!txnExecuted && isNetworkConnected) {
    var signedEip1559Txn = txnSign(privateKey, "eip1559");
    console.log("SIGNED EIP1559 TXN: " + signedEip1559Txn); //const legacyTxn = txnSign(privateKey, "legacy", address)
    //console.log("SIGNED LEGACY TXN: " + legacyTxn)

    txnExecuted = true;
  }
}, 2000);
