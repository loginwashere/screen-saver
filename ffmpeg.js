var ffmpeg = require('fluent-ffmpeg');
var request = require('request');
var moment = require('moment');
var fs = require('fs');
var Flickr = require("flickrapi"),
    flickrOptions = {
      api_key: process.env.FLICKR_API_KEY,
      secret: process.env.FLICKR_API_SECRET,
      user_id: process.env.FLICKR_USER_ID,
      access_token: process.env.FLICKR_ACCESS_TOKEN,
      access_token_secret: process.env.FLICKR_ACCESS_TOKEN_SECRET,
      permissions: 'write'
    };

var streamBuffers = require("stream-buffers");
var myWritableStreamBuffer = new streamBuffers.WritableStreamBuffer();

var readStream = request(process.env.VIDEO_STREAM_URL)
    .on('error', function(err) {
        console.log(err);
    })
    .on('start', function(commandLine) {
        console.log('Spawned Ffmpeg with command: ' + commandLine);
      })
    .on('end', function() {
        console.log('Processing finished !');
    });

ffmpeg()
  .input(readStream)
  .inputFormat('mjpeg')
  .frames(1)
  .format('mjpeg')
  .on('error', function(err, stdout, stderr) {
    console.log('An error occurred: ' + err.message);
    console.log(err);
    console.log('ffmpeg stdout: ' + stdout);
    console.log('ffmpeg stderr: ' + stderr);
  })
  .on('start', function(commandLine) {
    console.log('Spawned Ffmpeg with command: ' + commandLine);
  })
  .on('codecData', function(data) {
    console.log('Input is ' + data.audio + ' audio ' +
      'with ' + data.video + ' video');
  })
  .on('progress', function(progress) {
    console.log('Processing: ' + progress.percent + '% done');
  })
  .on('end', function() {
    console.log('Processing finished !');

    var date = moment().toISOString();
    var filename = 'Duet_' + date;
    var filepath = filename + '.jpg';

    var fileContents = myWritableStreamBuffer.getContents();

    var fileReadStream = new streamBuffers.ReadableStreamBuffer();
    fileReadStream.put(fileContents);

    var localfile = fs.createWriteStream(filepath);

    fileReadStream.pipe(localfile);

    Flickr.authenticate(flickrOptions, function(error, flickr) {

      // we can now use "flickr" as our API object
      var uploadOptions = {
        photo: {
          title: filename,
          tags: [],
          photo: filepath
        }
      };

      Flickr.upload(uploadOptions, flickr.options, function(err, result) {
        if(err) {
          throw err;
        }

        console.log('result', result);

        var groupsPoolsAddOptions = {
            user_id: process.env.FLICKR_USER_ID,
            photo_id: result[0],
            group_id: process.env.FLICKR_GROUP_ID,
            format: 'json'
        };

        flickr.groups.pools.add(groupsPoolsAddOptions, function(err, result) {
          if(err) {
            throw err;
          }
          console.log('result', result);

          process.exit();
        });
      });
    });

  })
  .pipe(myWritableStreamBuffer, {end: true});
