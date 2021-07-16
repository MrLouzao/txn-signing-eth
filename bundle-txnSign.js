"use strict";

var _common = _interopRequireDefault(require("@ethereumjs/common"));

var _tx = require("@ethereumjs/tx");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * Sign a transaction of type EIP-1559 (type 2)
 */
function eip1559Transaction(privateKey) {
  // Common is not necessary at all if it's provided as a parameter. Signature should be included.
  var common = new _common["default"]({
    chain: 'mainnet',
    hardfork: 'london'
  });
  var txData = {
    "data": "0x0",
    "gasLimit": "0x02625a00",
    "maxPriorityFeePerGas": "0x01",
    "maxFeePerGas": "0xff",
    "nonce": "0x00",
    "to": "0x203D17B4a1725E001426b7Ab3193E6657b0dBcc6",
    "value": "0x0186a0",
    "chainId": "0x1",
    "accessList": [],
    "type": "0x02"
  };

  var tx = _tx.FeeMarketEIP1559Transaction.fromTxData(txData, {
    common: common
  }); // Signing transaction


  var signedTx = tx.sign(privateKey); //console.log("Signed tx content --> ", signedTx)
  // Check v value:

  var v = signedTx.v;
  console.log("v = " + v); // Signed Tx in HEX

  var rawTx = "0x" + signedTx.serialize().toString("hex");
  console.log("RAW tx: " + rawTx);
  return rawTx;
}
/**
 * Legacy transaction signed without type, rlp encoded
 */


function legacyRlpTransaction(privateKey) {
  var txData = {
    "data": "0x0",
    // No contract data
    "gasLimit": "0xF4240",
    // 1 000 000
    "gasPrice": "0x6FC23AC00",
    //  30 Gwei
    "nonce": "0x00",
    // Nonce in Ropsten starts in 1048576
    "to": "0x203D17B4a1725E001426b7Ab3193E6657b0dBcc6",
    "value": "0x0186a0"
  }; // This is generating a transaction for mainnet. If we want to set the testnet, we need to use the common module
  // as we do in EIP1559 transactions

  var tx = new _tx.Transaction(txData); // Signing transaction

  var signedTx = tx.sign(privateKey); //console.log("Signed tx content --> ", signedTx)
  // Check v value:

  var v = signedTx.v;
  console.log("v = " + v); // In case of signing for mainnet a legacy txn, the values are {36,37}. In case of Ropsten, this can change

  if (!(v == 36 || v !== 37)) {
    throw "v is not {36,37}, your legacy transaction is not replay safe";
  } // Signed Tx in HEX


  var rawTx = "0x" + signedTx.serialize().toString("hex");
  console.log("RAW tx: " + rawTx);
  return rawTx;
} // To sign transactions import this module


var txnSign = function txnSign(privateKey, type) {
  if ("legacy" === type) {
    return legacyRlpTransaction(privateKey);
  } else if ("eip1559" === type) {
    return eip1559Transaction(privateKey);
  } else {
    throw "Not supported type: " + type;
  }
};

module.exports = txnSign;
