let config = require('config')
console.log('Using configuration %s',config.get('configName'))
let net = require('net')

let client = new net.Socket()
let wits_central_host = config.get('wits_central_host')
let wits_central_tcp_port = config.get('wits_central_tcp_port')
client.connect(wits_central_tcp_port, wits_central_host, function() {

  console.log('CONNECTED TO: ' + wits_central_host + ':' + wits_central_tcp_port)
  client.write('{"who": "i am spartacus", "id": "5f18453d-1907-48bc-abd2-ab6c24bc197d"}')
  client.write("\n");
})

client.on('data', function(data) {
  console.log('DATA: ' + data)
  client.destroy()
})

client.on('close', function() {
  console.log('Connection closed')
})
