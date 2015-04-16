require('events').EventEmitter.prototype._maxListeners = 250;

var express = require("express");
var path = require('path');
var app = express();
var fs = require('fs');
var adBuild = require(__dirname + "/adBuild");
var expressLess = require('express-less');

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

function createSizesLess() {
    fs.writeFile(__dirname + "/app/less/_sizes.less", getSizes().map(function (item, i) {
        return '@size_' + (i+1) + ': ~"(width: ' + item[0] + 'px) and (height: ' + item[1] + 'px)";';
    }).join("\n"), function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Saved _sizes.less");
        }
    });
}

function getSizes(){
    return require(__dirname + "/config.json");
}

createStyleFile();
createSizesLess();

app.get("/",function(req,res){
    var html = [
        //'<link rel="stylesheet" href="/packages/bootstrap/css/bootstrap.css"/>',
        //'<link rel="stylesheet" href="/packages/font-awesome/css/font-awesome.css"/>',
        '<link rel="stylesheet" href="less-css/frame.css"/>',
        '<script src="/packages/jquery/js/jquery.js"></script>',
        '<script src="js/frame.js"></script>',
        '<div class="container-fluid">'
    ];

    var _html = getSizes().map(function(item, index){
        var src = '/ad-build/ad/' + item[0] + '/' + item[1];
        return '<div class="panel panel-default"><div class="panel-heading">' + item[0] + '&times;' + item[1] + ' <small>(@size_ ' + index + ')</small></div><div class="panel-body"><img data-src="' + src + '" src="' + src + '" width="' + item[0] + '" height="' + item[1] + '"/><div class="loader"><i><i class=" fa fa-circle-o-notch fa-spin"></i></i></div></div></div>';
    });

    html.push(_html.join(''));
    html.push('</div>');

    res.send(html.join(''));
});


/*
app.param('ad_id', function (req, res, next, id) {
    console.log(req.params.ad_id);
    next();
});

*/


app.get("/ad-build/:source/:width/:height",function(req,res){
    var width = req.params.width;
    var height = req.params.height;
    var source = req.params.source;

    adBuild(source, width, height, function(imageName){
        console.log('Created: ' + imageName);
        res.sendFile(imageName);

    })
});

app.use(express.static('app'));
app.use('/packages/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use('/packages/jquery/js', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/packages/font-awesome', express.static(__dirname + '/node_modules/font-awesome'));
app.use('/less-css', expressLess(__dirname + '/app/less', { debug: true }));

app.listen(5000);
console.log("Server started on http://localhost:5000");