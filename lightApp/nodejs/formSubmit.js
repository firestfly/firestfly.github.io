var http = require('http'),
    url = require('url'),
    fs = require("fs"),
    qs = require('querystring'),
    server;
server = http.createServer(function (req, res) {
    var urlData,
        encode = "utf8",
        filePath = "./formSubmit.html",
        formData,
        action;
    urlData = url.parse(req.url, true);
    action = urlData.pathname;
    if (action === "/Signup") {
        formData = '';
        req.on("data", function (data) {
            formData += data;
            console.log(data)
        });
        req.on("end", function () {
            var msg;
            user = qs.parse(formData);
            user.id = "123456";
            msg = JSON.stringify(user);
            res.writeHead(200, {"Content-Type": "application/json;", "Content-Length": "500"});
            res.end(msg);
        });
    }
    else {
        fs.readFile(filePath, encode, function (err, file) {
            res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
            res.write(file);
            res.end();
        });
    }
});
server.listen(3000);
console.log('Server run:' + new Date());