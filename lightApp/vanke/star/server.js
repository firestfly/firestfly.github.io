
//var express = require('express');
//var path = require('path')
//var app = express();
// var httpProxy = require('http-proxy');

// app.use('/', express.static('public'));
// app.listen('3002');
// httpProxy.createProxyServer({target:'http://dev.vkrms.vanke.com:8080'}).listen(8000); // See (†) 

var express = require("express");
var proxy = require("express-http-proxy");
var bodyParser = require("body-parser");

// 声明 服务器实例
var app = express();
var port = 8088;

var apiProxy = proxy("http://t3.int.owl1024.com");

app.use(bodyParser.json());  //body-parser 解析json格式数据

app.use(bodyParser.urlencoded({            //此项必须在 bodyParser.json 下面,为参数编码
  extended: true
}));

app.use("/proxy",apiProxy);

app.use("/", express.static("public"));

app.listen(port);
