var serial = require('./serial'),
    fs = require('fs'),
    path = './dclient.js',
    cb = serial([
        function (err, data) {
            if (!err) {
                if (data.isFile) {
                    fs.readFile(path, cb);
                }
            } else {
                console.log(err);
            }
        },
        function (err, data) {
            if (!err) {
                console.log('[flattened by searial:]');
                console.log(data.toString('utf8'));
            } else {
                console.log(err);
            }
        }
    ]);
fs.stat(path, cb);
fs.stat(path, function (err, data) {
    if (!err) {
        if (data.isFile) {
            fs.readFile(path, function (err, data) {
                if (!err) {
                    console.log('[nested callbacks:]');
                    console.log(data.toString('utf8'));
                } else {
                    console.log(err);
                }
            });
        } else {
            console.log(err);
        }
    }
});