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
var a = readFile("./get.html");
a(function (data) {
    console.log(data)
}, function () {
});