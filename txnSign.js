import Common, {Chain} from '@ethereumjs/common'
import { FeeMarketEIP1559Transaction, AccessListEIP2930Transaction, Transaction } from '@ethereumjs/tx'

/**
 * Sign a transaction of type EIP-1559 (type 2)
 */
 function eip1559Transaction(privateKey, source) {
    // Common is not necessary at all if it's provided as a parameter. Signature should be included.
    const common = new Common({ chain: 'ropsten', hardfork: 'london'})

    const txData = {
        "data": "0x0",
        "gasLimit": "0x9c40",
        "maxPriorityFeePerGas": "0x01",
        "maxFeePerGas": "0xff",
        "nonce": "0x3a",
        "from": source, // origin wallet
        "to": "0x203D17B4a1725E001426b7Ab3193E6657b0dBcc6",
        "value": "0x0186a0"
    }

    console.log("TX DATA TO SIGN", txData)

    const tx = FeeMarketEIP1559Transaction.fromTxData(txData, {common})

    // Signing transaction
    const signedTx = tx.sign(privateKey)
    //console.log("Signed tx content --> ", signedTx)

    // Check v value:
    const v = signedTx.v;
    console.log("v = " + v)

    // Signed Tx in HEX
    const rawTx = "0x" + signedTx.serialize().toString("hex")
    console.log("RAW tx: "  + rawTx)
    return rawTx
}

/**
 * Legacy transaction signed without type, rlp encoded
 */
function legacyRlpTransaction(privateKey, txObject) {
    // This is generating a transaction for mainnet. If we want to set the testnet, we need to use the common module
    // as we do in EIP1559 transactions
    console.log(txObject)
    var tx = AccessListEIP2930Transaction.fromTxData(txObject);

    // Signing transaction
    const signedTx = tx.sign(privateKey)
 
    // Check v value:
    const v = signedTx.v;
    console.log("v = " + v)

    // In case of signing for mainnet a legacy txn, the values are {36,37}. In case of Ropsten, this can change
    if (!(v == 36 || v !== 37)) {
        throw "v is not {36,37}, your legacy transaction is not replay safe"
    }
 
    // Signed Tx in HEX
    const rawTx = "0x" + signedTx.serialize().toString("hex")
    return rawTx
}


// To sign transactions import this module
const txnSign = function(privateKey, type, txObject) {

    if ("legacy" === type) {
        return legacyRlpTransaction(privateKey, txObject)
    } else if ("eip1559" === type) {
        return eip1559Transaction(privateKey, source)
    } else {
        throw "Not supported type: " + type
    }

}

module.exports = txnSign