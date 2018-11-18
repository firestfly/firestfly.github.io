/**
 * Created by Administrator on 2014/5/28.
 */
var server = require("./service");
var router = require("./router");
var requestHandlers = require("./requestHandlers");
var handle = {}
handle["/"] = requestHandlers.start;
handle["/start"] = requestHandlers.start;
handle["/upload"] = requestHandlers.upload;
server.start(router.route, handle);