var phridge = require('phridge');

function screenshot(width, height, cb) {
    var image_name = __dirname + '/ads/' + width + '_' + height + '.png';

    phridge.spawn({}).then(function (phantom) {

        var mydata = {
            html: 'http://localhost:5000/ad.html',
            image_name: image_name,
            width: width,
            height: height
        };

        phantom.run(mydata, function (data, resolve) {
            // this code runs inside PhantomJS

            var page = webpage.create();

            page.viewportSize = {
                width: data.width,
                height: data.height
            };

            page.open(data.html, function () {
                page.render(data.image_name, {}, function () {
                    console.log('page rendered: ' + data.image_name);

                });
                resolve(data.image_name);
            });

        }).then(function (text) {
            cb(image_name);
        });

    });
}

module.exports = screenshot;