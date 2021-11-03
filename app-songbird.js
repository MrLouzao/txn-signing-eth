import Wallet from 'ethereumjs-wallet';

/**
 * This file is intended to handle Songbird transactions
 */
// Key and wallet generation - global variables
const privateKey = Buffer.from(
    '113b3b29d478ba21c69290104ac051e10d7ec7cb1c0cd0b5abcf2db4b830fb3c',
    'hex',
)

const userWallet = Wallet.fromPrivateKey(privateKey)
const publicKey = userWallet.getPublicKeyString()
const address = userWallet.getAddressString()

//console.log('private key: ' + userWallet.getPrivateKeyString())
console.log('public key: ' + publicKey)
console.log('address: ' + address) // If the address is running out of funds, use a fauced to get more ETH

// Helper functions - Convert number to hex
function parseToHex(num) {
    return "0x" + num.toString(16);
}
function parseGweiToWeiHex(gwei) {
    const totalWei = gwei * 1000000000
    return parseToHex(totalWei)
}

// Simulate offline transaction
const txnSign = require('./bundle-txnSign')
var txnExecuted = false
setInterval(function() {
    if (!txnExecuted){

        const tx = {
            to: "0xffC11262622D5069aBad729efe84a95C169d9c06", // replace with dest
            nonce: parseToHex(1),
            gasPrice: parseGweiToWeiHex(256),
            gasLimit: parseToHex(21000),
            value: parseGweiToWeiHex(1), // only if want to send something; if not then not provide
            data: "0x", // put here if want to sign something
            chainId: 19 // Songbird
        }

        const legacyTxn = txnSign(privateKey, "legacy", tx)
        console.log("SIGNED LEGACY TXN: " + legacyTxn)
        txnExecuted = true
    } else {
        console.log('end')
        process.exit(1)
    }
}, 2000)
