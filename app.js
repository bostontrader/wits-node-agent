const config = require('config')
console.log('Using configuration %s',config.get('configName'))

const net = require('net')
const fs = require('fs')

const client = new net.Socket()
const wits_central_host = config.get('wits_central_host')
const wits_central_tcp_port = config.get('wits_central_tcp_port')
client.connect(wits_central_tcp_port, wits_central_host, function() {
  console.log('CONNECTED TO: ' + wits_central_host + ':' + wits_central_tcp_port)
  client.write('{"messageType":"introduction", "name": "Joybook"}')
})

client.on('data', function(data) {
  console.log('DATA: ' + data)
  const n = JSON.parse(data)
  // Evolve this to be a FSM.  For now, just hack away at it.
  if(n.messageType === 'getNext') {
    const n = {"messageType":"object_info", "name": bItr.next()}
    client.write(JSON.stringify(n))
  }
})

client.on('close', function() {
  console.log('Connection closed')
})

/*
 The purpose of this generator is to recursively perform a depth-first iteration over a file system.
 Every time this generator is called, it will return the next file/directory.

 The file system operations herein are their synchronous versions.  Doing this asynchronously gets too
 complicated (cuz we have to figure out how to get the yields out of the callbacks) and it's not
 necessary anyway.

 */
function *branchIterator(path, level) {

  try {
    const stats = fs.statSync(path)

    if (stats.isDirectory()) {
      // This is a directory, so now get the contents

      const files = fs.readdirSync(path)

      yield {"path": path, "directory": true, "file": false}

      for (let file of files) {
        if (level < 1) {
          // The root "/" is a special case.
          const nextPath = (path === "/") ? path + file : path + "/" + file
          yield* branchIterator(nextPath, level + 1)
        }
      }
    } else if (stats.isFile()) {
      yield {"path": path, "directory": false, "file": true}
    } else {
      // Not a directory or a file. WTF is it?
      yield {"path": path, "directory": false, "file": false}
    }

  } catch(err) {
    yield {"error":err}
  }
}

const bItr = branchIterator("/", 0)