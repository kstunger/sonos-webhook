# sonos-ewelink-webhook
Node.js REST server that listens for POST requests from jishi/node-sonos-http-api when registered as a webhook.  Watches playbackState in the POSTed JSON, and triggers POST request(s) to the configured URL(s).  

Example configuration is below.  For each state reported by node-sonos-http-api, a URL can by configured followed by the number of milliseconds to delay before making the request.
```
{
  "Living Room": {
    "Amp Plug": {
      "PLAYING": {
        "http://192.168.1.18:8123/api/webhook/-8dj9jkn2k": 0
      },
      "PAUSED_PLAYBACK": {
        "http://192.168.1.18:8123/api/webhook/-8dj9jkn2k": 600000
      },
      "STOPPED": {
        "http://192.168.1.18:8123/api/webhook/-8dj9jkn2k": 600000
      }
    },
    "Sub Plug": {
      "PLAYING": {
        "http://192.168.1.18:8123/api/webhook/-8dj9jkn2k": 0
      },
      "PAUSED_PLAYBACK": {
        "http://192.168.1.18:8123/api/webhook/-8dj9jkn2k": 600000
      },
      "STOPPED": {
        "http://192.168.1.18:8123/api/webhook/-8dj9jkn2k": 600000
      }
    }
  }
}
```

