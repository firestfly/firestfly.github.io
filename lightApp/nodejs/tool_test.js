var http = require('http');
var server = http.createServer(function (request, response) {
    this.emit('init', request, response);
    console.log("test OK");
});
server.on('init', require('./tool').cookieParser);
server.listen(8080, '127.0.0.1');