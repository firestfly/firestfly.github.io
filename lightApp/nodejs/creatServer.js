/**
 * Created by Administrator on 2014/5/22.
 */
var server,
    ip = "127.0.0.1",
    port = 8080,
    http = require('http'),
    url = require('url'),
    qs = require('querystring'),
    path;
server = http.createServer(function (req, res) {
    path = url.parse(req.url);
    parameter = qs.parse(path.query);
    console.dir(parameter);
    res.writeHead(200, {'Content-Type': 'text/plain'});
    switch (path.pathname) {
        case "/index":
            res.end('I am index.\n');
            break;
        case "/test":
            res.end('this is test page.sdfd \n');
            break;
        default:
            res.end('default page.\n');
            break;
    }
});
server.listen(port, ip);
console.log("Server running at http://" + ip + ":" + port);