require('events').EventEmitter.prototype._maxListeners = 250;

var express = require("express");
var path = require('path');
var app = express();
var fs = require('fs');
var adBuild = require(__dirname + "/adBuild");

function createStyleFile() {
    fs.writeFile(__dirname + "/app/css/_style.css", getSizes().map(function (item) {
        return '@media (width: ' + item[0] + 'px) and (height: ' + item[1] + 'px) {}';
    }).join("\n"), function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Saved _style.css");
        }
    });
}

function getSizes(){
    return require(__dirname + "/config.json");
}

createStyleFile();

app.get("/",function(req,res){
    var html = [
        '<link rel="stylesheet" href="bootstrap.css"/>',
        '<link rel="stylesheet" href="fa/css/font-awesome.css"/>',
        '<link rel="stylesheet" href="css/frame.css"/>',
        '<script src="jquery.js"></script>',
        '<script src="js/frame.js"></script>',
        '<div class="container-fluid">'
    ];

    var _html = getSizes().map(function(item, index){
        return '<div class="panel panel-default"><div class="panel-heading">' + item[0] + '&times;' + item[1] + '</div><div class="panel-body"><img data-src="/ad-build/' + index + '" src="/ad-build/' + index + '" width="' + item[0] + '" height="' + item[1] + '"/><i class="hidden fa fa-circle-o-notch fa-spin"></i></div></div>';
    });

    html.push(_html.join(''));
    html.push('</div>');

    res.send(html.join(''));
    createStyleFile();
});


/*
app.param('ad_id', function (req, res, next, id) {
    console.log(req.params.ad_id);
    next();
});

*/


app.get("/ad-build/:ad_id",function(req,res){
    var adId = req.params.ad_id;
    var config = getSizes();

    if(config[adId]){
        adBuild(config[adId][0], config[adId][1], function(imageName){
            console.log('Created: ' + imageName);
            if(req.xhr){

                var buffer = fs.readFileSync(imageName);
                var type = 'image/png';

                res.json({
                    'created': true,
                    'data': 'data:' + type + ';base64,' + buffer.toString('base64')
                });
            } else {
                res.sendFile(imageName);
            }

        })
    } else {
        res.sendStatus(404);
    }
});

app.use(express.static('app'));
app.use(express.static('node_modules/bootstrap/dist/css'));
app.use(express.static('node_modules/jquery/dist'));
app.use('/fa', express.static(__dirname + '/node_modules/font-awesome'));

app.listen(5000);
console.log("Server started on http://localhost:5000");