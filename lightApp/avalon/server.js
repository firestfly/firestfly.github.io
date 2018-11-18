var express = require('express');
var url = require('url');

var app = express();

app.use('/', express.static(__dirname));


app.listen(3004);

console.log('server ready');