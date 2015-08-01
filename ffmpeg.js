var ffmpeg = require('fluent-ffmpeg');
var request = require('request');
var mailgun = require('mailgun-js')({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
});
var writeStream = require('stream').Writable;

var readStream = request(process.env.VIDEO_STREAM_URL);

ffmpeg({
    "source": readStream,
    "timeout": 0
})
  .frames(1)
  .output(writeStream)
  .on('error', function(err) {
    console.log('An error occurred: ' + err.message);
    console.log(err);
  })
  .on('end', function() {
    console.log('Processing finished !');

    var date = moment().toISOString();
    var filename = 'Duet ' + date;

    var attch = new mailgun.Attachment({data: writeStream, filename: filename});

    var data = {
      from: 'Excited User <me@samples.mailgun.org>',
      to: process.env.UPLOAD_MAIL_ADDRESS,
      subject: filename,
      text: 'Image for ' + filename,
      attachment: attch
    };

    mailgun.messages().send(data, function (error, body) {
      console.log(body);
    });

  })
  .run();
