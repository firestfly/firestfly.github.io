var ip = "127.0.0.1",
    port = 8080,
    http = require('http'),
    url = require('url'),
    server = http.createServer(function (req, res) {
        var urlData = url.parse(req.url, true);
        console.log(urlData, urlData.query.username),
            action = urlData.pathname;
        res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
        if (action === "/Signup") {
            user = urlData.query;
            res.end("<h1>" + user.username + "</h1><p>" + "" + user.email + "</p>");
        }
    });
server.listen(port, ip);
console.log('Server Run,现在时间是:' + new Date());
console.log("Server running at http://" + ip + ":" + port);
