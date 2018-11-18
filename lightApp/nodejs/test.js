var http = require('http');
for (var i in http) {
    console.log(i);
}
var fs = require('fs');
var readFile = function (path) {
    return function (callback, errback) {
        fs.readFile(path, "utf8", function (err, data) {
            if (err) {
                errback();
            } else {
                callback(data);
            }
        });
    };
}
http.createServer(function (request, response) {
    var a = readFile("./test.text");
    a(function (data) {
        response.writeHead(200, {'Content-Type': 'text/html;charset=utf-8;'});
        response.write(data);
        response.end();
    }, function () {
        response.writeHead(404, {'Content-Type': 'text/plain'});
        response.write("404");
        response.end();
    });
    //response.end('Hello World\n');
    buf = new Buffer(256);
    len = buf.write('\u00bd + \u00bc = \u00be', 0);
    console.log(len + " bytes: " + buf.toString('utf8', 0, len));

}).listen(8080);

console.log('Server running at http://127.0.0.1:8080/');