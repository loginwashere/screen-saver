var phantom = require('phantom');

phantom.create(function (ph) {
  ph.createPage(function (page) {
    page.open("http://37.57.72.244:/snapshot.cgi", function (status) {
      console.log("opened google? ", status);
      page.evaluate(
        function () {
            console.log(1);
            return document.title;
        },
        function (result) {
            console.log(2);
            console.log('Page title is ' + result);

          //   Flickr.authenticate(FlickrOptions, function(error, flickr) {
          //     var uploadOptions = {
          //       photos: [{
          //         title: "test",
          //         tags: [
          //           "happy fox",
          //           "test 1"
          //         ],
          //         photo: __dirname + "/test.jpg"
          //       },{
          //         title: "test2",
          //         tags: "happy fox image \"test 2\" separate tags",
          //         photo: __dirname + "/test.jpg"
          //       }]
          //     };

          //     Flickr.upload(uploadOptions, FlickrOptions, function(err, result) {
          //       if(err) {
          //         return console.error(error);
          //       }
          //       console.log("photos uploaded", result);


          //       ph.exit();
          //     });
          //   });
        }
      );

      page.render('technews.png');

      ph.exit();
    });

    page.onError = function (msg, trace) {
      console.log(msg);
      trace.forEach(function(item) {
        console.log('  ', item.file, ':', item.line);
      });
    };
  });
});

phantom.onError = function (msg, trace) {
  console.log(msg);
  trace.forEach(function(item) {
    console.log('  ', item.file, ':', item.line);
  });
};
