# dash-hue-light-control
This program let you control your light with Amazon dash button. dash-hue-light-control
support nodejs versions 7 and superiors.

## Contents

 * [Prerequisite](https://github.com/mbret/dash-hue-light-control#prerequisite)
 * [Installation](https://github.com/mbret/dash-hue-light-control#installation)
 * [Usage](https://github.com/mbret/dash-hue-light-control#usage)
 * [Run it as a background process](https://github.com/mbret/dash-hue-light-control#run-it-as-a-background-process)
 * [Note about dash button](https://github.com/mbret/dash-hue-light-control#note-about-dash-button)
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
Just create a `settings.json` somewhere. Then navigate to the module folder and run:

`sudo dash-hue-light-control --settings=path/to/settings.json`

The process will keep watching for your dash press action and control the light.

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

## Note about dash button
Due to how the button is designed (sleep, wake up, connect to wifi, arp, sleep, ...) there is a noticeable timeout between a press and its action. I cannot do anything about
that and remember that this is a 2€ smart button after all.

## Next updates
- control the color/intensity/whatever