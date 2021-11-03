"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _common = _interopRequireWildcard(require("@ethereumjs/common"));

var _tx = require("@ethereumjs/tx");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/**
 * Sign a transaction of type EIP-1559 (type 2)
 */
function eip1559Transaction(privateKey, source) {
  // Common is not necessary at all if it's provided as a parameter. Signature should be included.
  var common = new _common["default"]({
    chain: 'ropsten',
    hardfork: 'london'
  });
  var txData = {
    "data": "0x0",
    "gasLimit": "0x9c40",
    "maxPriorityFeePerGas": "0x01",
    "maxFeePerGas": "0xff",
    "nonce": "0x3a",
    "from": source,
    // origin wallet
    "to": "0x203D17B4a1725E001426b7Ab3193E6657b0dBcc6",
    "value": "0x0186a0"
  };
  console.log("TX DATA TO SIGN", txData);

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


function legacyRlpTransaction(privateKey, txObject) {
  // This is generating a transaction for mainnet. If we want to set the testnet, we need to use the common module
  // as we do in EIP1559 transactions
  console.log(txObject);

  var tx = _tx.AccessListEIP2930Transaction.fromTxData(txObject); // Signing transaction


  var signedTx = tx.sign(privateKey); // Check v value:

  var v = signedTx.v;
  console.log("v = " + v); // In case of signing for mainnet a legacy txn, the values are {36,37}. In case of Ropsten, this can change

  if (!(v == 36 || v !== 37)) {
    throw "v is not {36,37}, your legacy transaction is not replay safe";
  } // Signed Tx in HEX


  var rawTx = "0x" + signedTx.serialize().toString("hex");
  return rawTx;
} // To sign transactions import this module


var txnSign = function txnSign(privateKey, type, txObject) {
  if ("legacy" === type) {
    return legacyRlpTransaction(privateKey, txObject);
  } else if ("eip1559" === type) {
    return eip1559Transaction(privateKey, source);
  } else {
    throw "Not supported type: " + type;
  }
};

module.exports = txnSign;
