var http = require('http');
var tools = {
    cookieParser: function (request, response) {
        if (request.headers['Cookie']) {
            //do parsing
        }
        console.log(request.headers);
        response.writeHead(200, {'Content-Type': 'text/plain'});
        response.end('Hello World\n');
    }
};
var server = http.createServer(function (request, response) {
    this.emit('every', request, response);
});
server.on('every', tools.cookieParser);
server.listen(8080, '127.0.0.1');