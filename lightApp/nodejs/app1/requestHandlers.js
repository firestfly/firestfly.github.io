/*
 function start() {
 console.log("Request handler 'start' was called.");
 function sleep(milliSeconds) {
 var startTime = new Date().getTime();
 while (new Date().getTime() < startTime + milliSeconds);
 }

 sleep(10000);
 return "Hello Start";
 }
 function upload() {
 console.log("Request handler 'upload' was called.");
 return "Hello Upload";
 }
 exports.start = start;
 exports.upload = upload;*/

//非阻塞操作
var exec = require("child_process").exec;

function start() {
    console.log("Request handler 'start' was called.");
    var content = "empty";
    /*exec("ls -lah", function (error, stdout, stderr) {
     content = stdout;
     });*/
    //更耗时的find
    exec("find/", function (error, stdout, stderr) {
        content = stdout;
    });
    console.log(content);
    return content;
}

function upload() {
    console.log("Request handler 'upload' was called.");
    return "Hello Upload";
}

exports.start = start;
exports.upload = upload;