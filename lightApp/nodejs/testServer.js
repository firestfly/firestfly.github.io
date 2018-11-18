/**
 * Created by Administrator on 2014/5/28.
 */
var express = require("express"), port = 8080;
var app = express();
app.listen(port);
var fs = require("fs");
var url = require("url");
var qs = require("querystring");

app.all("/user/:id/:opt", function (req, res, next) {
    req.id = req.params.id;
    req.opt = req.params.opt;
    console.log(req.params.opt);
    if (req.id) {
        next();
    } else {
        throw(new Error("Sorry ! u can't"));
    }
})
app.get("/", function (req, res) {
    var filePath = "./formSubmit.html";
    fs.readFile(filePath, "utf8", function (err, file) {
        res.writeHead(200, {"Content-Type": "text/html;charset=utf-8;"});
        //res.write(file);
        var qStr = "user=me&ban=us&lang=en";
        var obj = qs.parse(qStr);
        console.log(obj);
        res.end(file);
    });
});
app.get("/user/:id/:opt", function (req, res) {
    res.writeHead(200, {"Content-Type": "text/html;charset=utf-8;"});
    var urlData = url.parse(req.url, true);

    req.on("data", function (data) {
        console.log(data)
    });
    req.on("end", function () {
        res.end(req.id + req.opt + urlData);
    });
    res.end(req.id + req.opt + urlData);

    console.log(urlData)
});
