import Wallet from 'ethereumjs-wallet';

// Key and wallet generation - global variables
const privateKey = Buffer.from(
    '',
    'hex',
)

const userWallet = Wallet.fromPrivateKey(privateKey)
const publicKey = userWallet.getPublicKeyString()
const address = userWallet.getAddressString()

console.log('private key: ' + userWallet.getPrivateKeyString())
console.log('public key: ' + publicKey)
console.log('address: ' + address) // If the address is running out of funds, use a fauced to get more ETH


// TODO create an express server that exposes an endpoint for executing signatures
//  - Only sign in case of being connected to the network

// Behaviour here is intended to simulate the TODO behaviour
// Only sign transactions if the network is offline
const subscribe = require('./checkConnection')
var isNetworkConnected = false
subscribe(function(isConnected) {
    const isConn = isConnected? "connected" : "disconnected"
    console.log("Network status change::" + isConn)
    isNetworkConnected = isConnected
})

// Simulate offline transaction
const txnSign = require('./bundle-txnSign')
var txnExecuted = false
setInterval(function() {
    if (!txnExecuted 
        //&& !isNetworkConnected // uncomment line if we want to try the offline functionality
        ){
        //const signedEip1559Txn = txnSign(privateKey, "eip1559")
        //console.log("SIGNED EIP1559 TXN: " + signedEip1559Txn)

        const legacyTxn = txnSign(privateKey, "legacy", address)
        console.log("SIGNED LEGACY TXN: " + legacyTxn)

        txnExecuted = true
    }
}, 2000)
