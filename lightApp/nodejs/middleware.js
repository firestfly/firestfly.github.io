/**
 * Created by Administrator on 2014/5/22.
 */
var express = require("express"), port = 8080;
var app = express();
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.session());