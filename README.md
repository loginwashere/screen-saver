# screen-saver

This apps helps save video screenshots to flickr.

## Setup

Using ffmpeg it reads video frames from for example web camera,
then it uploads it to flickr and adds uploaded photo to group.

All required settings are located in ```.bin/.env```
This file is not stored in repository and you can create it
by copying ```.bin/.env.sample```.

After creating ```.bin/.env``` you need to go to [flickr](https://www.flickr.com/services/apps/create/)
and create app.

After creating app copy api key and api secret to ```.bin/.env```.
Also you need to specify id of group and also copy it to ```.bin/.env```.
Don't forget to specify link to video,

To apply setting from ```.bin/.env``` run command ```source .bin/.env```.

To install app dependencies run ```npm install```.

After this you can run app using command ```node index.js```.

When you run it first time it will open browser and request permission from flickr.
When you agree you will be asked to copy code to cli.
Then you will see in cli something like this:

```
Add the following variables to your environment:

export FLICKR_USER_ID=your-user-id
export FLICKR_ACCESS_TOKEN="your-access-token"
export FLICKR_ACCESS_TOKEN_SECRET="your-access-token-secret"
```

Copy values from cli to ```.bin/.env``` and run again ```source .bin/.env``` to update settings.

Now you can run this script without entering code from site.

## Deploy to heroku

This app uses this buildpack - [heroku-buildpack-multi](https://github.com/ddollar/heroku-buildpack-multi).
It allows include in one app several buildpacks by adding links to them in file ```.buildpacks```

For example in this app we are using:
- [heroku-buildpack-nodejs](https://github.com/heroku/heroku-buildpack-nodejs#v77) - to install nodejs
- [heroku-buildpack-ffmpeg](https://github.com/HYPERHYPER/heroku-buildpack-ffmpeg.git) - to install ffmpeg

After deploy to heroku you need to set config variables from ```.bin/.env```.
To do this you need to use command ```heroku config:set FLICKR_API_KEY="your-api-key"```.
This way you need to add all config variables to heroku.

To automate launch of this app you can use addon [Heroku Scheduler](https://devcenter.heroku.com/articles/scheduler).
In free mode (check this info on official site) you can set to run this app every 10 minutes, hourly or dayly.
