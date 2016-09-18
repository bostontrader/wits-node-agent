var net = require('net');

var HOST = '192.168.1.104';
var PORT = 8000;

var client = new net.Socket();
client.connect(PORT, HOST, function() {

    console.log('CONNECTED TO: ' + HOST + ':' + PORT);
    // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client
    client.write('{"who": "i am spartacus", "id": "5f18453d-1907-48bc-abd2-ab6c24bc197d"}')
    client.write("\n");

});

client.on('data', function(data) {
    console.log('DATA: ' + data);
    client.destroy();
})

client.on('close', function() {
    console.log('Connection closed');
})
