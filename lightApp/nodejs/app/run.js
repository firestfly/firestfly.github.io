/**
 * Created by Administrator on 2014/5/28.
 */
var server = require("./start");
var router = require("./router");
server.start(router.route);