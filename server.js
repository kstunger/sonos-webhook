'use strict';
const http = require('http');
const fs = require('fs');

const testing = false;

function makePlugRequest(host, port, deviceId, state) {
  console.log("Turning " + state + " plug with ID " + deviceId);

  const data = "{\"params\": {\"switch\": \"" + state + "\"},\"deviceid\": \"" + deviceId + "\"}";

  if(testing) {
    console.log("Plug request skipped.  Testing.");
    return;
  }

  console.log("POSTing: ");
  console.log(data);

  const options = {
    hostname: host,
    port: port,
    path: '/',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  }

  const req = http.request(options, res => {
    console.log(`statusCode: ${res.statusCode}`)

    res.on('data', d => {
      process.stdout.write(d)
    })
  })

  req.on('error', error => {
    console.error(error)
  })

  req.write(data)
  req.end()
}

fs.readFile('./settings.json', 'utf8', (err, data) => {
  if (err) {
    console.log(`Error reading file from disk: ${err}`);
    process.exit(1);
  }

  // parse JSON string to JSON object
  const settings = JSON.parse(data);

  let server = http.createServer((req, res) => {
    console.log('');

    const buffer = [];
    req.on('data', (data) => buffer.push(data.toString()));
    req.on('end', () => {
      res.end();

      try {
        const json = JSON.parse(buffer.join(''));
        console.log('');

        console.log("Detected state: " + json.data.state.playbackState);
        if (typeof json.data.state.playbackState !== 'undefined') {
          var room = json.data.roomName.replace(/['"]+/g, '')
          var state = json.data.state.playbackState.replace(/['"]+/g, '')
          console.log(room + ": " + state);

          if(settings[room]) {
            console.log("Getting devices for " + room);

            var obj = settings[room];
            Object.keys(obj).forEach(function(key){
              //Stop any scheduled changes to the plug
              if (typeof settings[room][key].timeout !== 'undefined') {
                clearTimeout(settings[room][key].timeout);
                settings[room][key].timeout = undefined;
              }
              
              console.log("Triggering state '" + Object.keys(obj[key][state])[0] + "' on " + key + "(" + obj[key].deviceId + ") for " + room + " in " + Object.values(obj[key][state])[0] + " milliseconds");
              settings[room][key].timeout = setTimeout(function (server, port, deviceId, state) {
                makePlugRequest(server, port, deviceId, state);
              }, Object.values(obj[key][state])[0], settings.ewelink_server, settings.ewelink_port, obj[key].deviceId, Object.keys(obj[key][state])[0]);
            });
          }
        }
      } catch (e) {}
    });
  });

  server.listen(5007);
  console.log('Listening on http://localhost:5007/');
});
