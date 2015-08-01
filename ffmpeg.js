var ffmpeg = require('fluent-ffmpeg');
var request = require('request');
var moment = require('moment');
var mailgun = require('mailgun-js')({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
});

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

    var attachment = new mailgun.Attachment({
      filename: filepath,
      data: myWritableStreamBuffer.getContents()
    });

    var data = {
      from: process.env.UPLOAD_MAIL_ADDRESS_FROM,
      to: process.env.UPLOAD_MAIL_ADDRESS,
      subject: filename,
      text: 'Image for ' + filename,
      attachment: attachment
    };

    mailgun.messages().send(data, function (error, body) {
      if (error) {
        throw error;
      }
      console.log(body);

      process.exit();
    });

  })
  .pipe(myWritableStreamBuffer, {end: true});
