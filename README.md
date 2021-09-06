# sonos-ewelink-webhook
Node.js REST server that listens for POST requests from jishi/node-sonos-http-api when registered as a webhook.  Watches playbackState in the POSTed JSON, and triggers POST to doganm95/ewelink-rest-api-server.  

Example configuration is below.  For each state reported by node-sonos-http-api, a command accepted by ewelink-rest-api-server (currently on, off and toggle) can by configured followed by the number of milliseconds to delay before making the request.
```
{
  "ewelink_server": "192.168.1.8",
  "ewelink_port": 8881,
  "Living Room": {
    "Amp Plug": {
      "deviceId": "100120xxxxx",
      "PLAYING": {
        "on": 0
      },
      "PAUSED_PLAYBACK": {
        "off": 600000
      },
      "STOPPED": {
        "off": 600000
      }
    },
    "Sub Plug": {
      "deviceId": "10012xxxxx",
      "PLAYING": {
        "on": 0
      },
      "PAUSED_PLAYBACK": {
        "off": 600000
      },
      "STOPPED": {
        "off": 600000
      }
    }
  }
}
```

