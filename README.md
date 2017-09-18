# dash-hue-light-control
This program let you control your light with Amazon dash button. dash-hue-light-control
support nodejs versions 7 and superiors. With this module you will basically be able to set 
a button that switch light or use the function directly programmatically and import it
to your existing module.

To use this program you will need your dash button configured and ready and have access (ip + token)
to your hue light. I'm writing a cli/module helper to get a convenient way to get this.

Please, feel free to send me any feedback or open issues on the github page.

### Jeedom, Domoticz, etc
If you want me to create a compatible plugin for domotics software just get in touch with me. It would be a pleasure
to improve my module and make it useable for your system.

## Contents

 * [Prerequisite](https://github.com/mbret/dash-hue-light-control#prerequisite)
 * [Installation](https://github.com/mbret/dash-hue-light-control#installation)
 * [Usage](https://github.com/mbret/dash-hue-light-control#usage)
 * [Run it as a background process](https://github.com/mbret/dash-hue-light-control#run-it-as-a-background-process)
 * [Usage as a node module (programmatically)](https://github.com/mbret/usage-as-a-node-module-(programmatically))
 * [Note about dash button](https://github.com/mbret/dash-hue-light-control#note-about-dash-button)
 * [Known issues](https://github.com/mbret/dash-hue-light-control#known-issues)
 * [Next updates](https://github.com/mbret/dash-hue-light-control#next-updates)

## Prerequisite
You need [nodejs](https://nodejs.org/en/) 7 or superior and a Unix system. This program does not
works on Windows for now due to the use of libpcap. You will also need to setup your dash 
and have an access token to your hue bridge. You can follow the step 2 from this guide to configure
your dash [http://www.instructables.com/id/Amazon-Dash-Button-Hack](http://www.instructables.com/id/Amazon-Dash-Button-Hack).
In order to have authorization to your bridge you will need to access its api and generate new user.
Follow the official guide to help you in the process [https://developers.meethue.com/documentation/getting-started](https://developers.meethue.com/documentation/getting-started).

## Installation
``` sh
# library needed for read requests from dash buttons
$ sudo apt-get install libpcap-dev
# actual program sources
# You may need sudo to install the module
$ npm install -g dash-hue-light-control
```

## Usage
Just create a `settings.json` somewhere and use its location as argument:
``` sh
$ sudo dash-hue-light-control start path/to/settings.json
```

The process will keep watching for your dash press action and control the light.

To get more information about available options just use:

``` sh
$ dash-hue-light-control
# or
$ dash-hue-light-control --help
```
### settings.json sample
```json
{
  "jwt": "FkXIos6bRxzyy54qsspHLa2MGx5-IQkWNLfIbn4",
  "bridge": "192.168.0.10",
  "dash": "b4:7c:9c:49:b4:d4",
  "lightId": "2",
  "mode": "toggle"
}
```
The available modes are:

- `toggle`
- `on`
- `off`

The toggle mode will either turn on or off your light depending on its current state.

## Run it as a background process
In the real world you probably want to run this program as a background process and let it run forever.
An easy way to do it is to download [pm2](https://github.com/Unitech/pm2) or other process manager and
run the command `sudo node index --settings=path/to/settings.json` through this process manager. Refer to the
dedicated doc for more info.

Here is an example with pm2:
- `npm install pm2 -g`
- `pm2 start dash-hue-light-control --name="my-dash-control" -- --settings=/path/to/settings.json`

Note that you will probably need to run this as sudo as well because of PcapSession

## Usage as a node module (programmatically)
You can import this program like any module and use it programmatically.
For now the api is still rather light and will be improved over time.
```javascript
const DashHueLightControl = require('dash-hue-light-control')
// you may pass some settings (ex: activate log, etc)
const dashHueLightControl = DashHueLightControl({})

try {
  // start one watch
  dashHueLightControl
    .start({
      "jwt": "FkXIos6bRxzyy54qsspHLa2MGx5-IQkWNLfIbn4",
      "bridge": "192.168.0.10",
      "dash": "b4:7c:9c:49:b4:d4",
      "lightId": "2",
      "mode": "toggle"
    })
} catch (e) {
  console.error('Oops, the program has crashed!', e)
}
```

## Note about dash button
Due to how the button is designed (sleep, wake up, connect to wifi, arp, sleep, ...) there is a noticeable timeout between a press and its action. I cannot do anything about
that and remember that this is a 2€ smart button after all.
- Use DHCP Reservation on your Amazon Dash Button to lower the latency from ~5s to ~1s.
- Dash buttons cannot be used for another ~10 seconds after they've been pressed.
Thanks [ricardo1980](https://www.npmjs.com/~ricardo1980) for the tips.

## Known issues
- I once got two triggers for one button press (never had again). It happened after a long inactivity of my button. It basically
turned the light on and off directly after. Never had again but I guess the button sometimes send more request. I will
dig into the settings to see if I can avoid it.

## Next updates
- control the color/intensity/whatever
- Use local user file to allow cli session when using mac address, etc