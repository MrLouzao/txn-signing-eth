"use strict";

var _common = _interopRequireDefault(require("@ethereumjs/common"));

var _tx = require("@ethereumjs/tx");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }


  // Data to feed the wallet
  const twoGwei = "0x77359400";
  const lessThanTwoGwei = "0x70A71C80";
  const devAddress = "0x3a60f2900624785babcf58d2bd30a8fae8a80c38";
  const ropstenChainId = "0x3";
  const nonce = "0x9"; // increment each time you send a txn
  const amountInWei = "0x16bcc41e9000"; // 0.00002500 ETH

/**
 * Sign a transaction of type EIP-1559 (type 2)
 */
function eip1559Transaction(privateKey) {
  // Common is not necessary at all if it's provided as a parameter. Signature should be included.
  var common = new _common["default"]({
    chain: 'ropsten',
    hardfork: 'london'
  });

  var txData = {
    "data": "0x0",
    "gasLimit": "0x9c40",
    "maxPriorityFeePerGas": lessThanTwoGwei,
    "maxFeePerGas": twoGwei,
    "nonce": nonce,
    "to": devAddress,
    "value": amountInWei,
    "chainId": ropstenChainId,
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
function legacyRlpTransaction(privateKey, fromAddr) {
  var txData = {
    "from": fromAddr,
    "data": "0x0",
    // No contract data
    "gasLimit": "0x9c40",
    // 1 000 000
    "gasPrice": "0x6FC23AC00",
    //  30 Gwei
    "nonce": nonce,
    // Nonce in Ropsten starts in 1048576
    "to": devAddress,
    "value": amountInWei
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


var txnSign = function txnSign(privateKey, type, fromAddr) {
  if ("legacy" === type) {
    return legacyRlpTransaction(privateKey, fromAddr);
  } else if ("eip1559" === type) {
    return eip1559Transaction(privateKey);
  } else {
    throw "Not supported type: " + type;
  }
};

module.exports = txnSign;
