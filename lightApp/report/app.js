var express = require('express');
var proxy = require('express-http-proxy');
var url = require('url');

var app = express();

app.use('/', express.static(__dirname));

app.use('/', proxy('http://op.juhe.cn', {
    forwardPath: function (req, res) {
        return '/' + url.parse(req.url).path;
    }
}));

app.listen(3003);

console.log('server ready');