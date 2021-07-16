const dns = require("dns");
let isConnected = false;

let subscribers = []

function liveCheck() {
  dns.resolve("www.google.com", function(err, addr) {
    if (err) {
      if (isConnected) {
        console.log("Disconnected")
        subscribers.forEach(cb => cb(!isConnected))
      }
      isConnected = false;
    } else {
      if (isConnected) {
        //connection is still up and running, do nothing
      } else {
        console.log("Connected")
        subscribers.forEach(cb => cb(!isConnected))
      }
      isConnected = true;
    }
  });
}

setInterval(function() {
  liveCheck();
}, 1000);

// Subscribe a function
const subscribe = function(cb) {
    console.log("subscribing..")
    subscribers.push(cb)
}

module.exports = subscribe;