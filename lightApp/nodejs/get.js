/*
 var wait = function (callbacks, done) {
 console.log('wait start');
 var counter = callbacks.length;
 var results = [];
 var next = function (result) {
 results.push(result);
 if (--counter == 0) {
 done(results);
 }
 };
 for (var i = 0; i < callbacks.length; i++) {
 callbacks[i](next, results);
 }
 console.log('wait end');
 }
 wait(
 [function (next, results) {
 setTimeout(function () {
 console.log('done a');
 var result = 500;
 next(result);
 console.log(results);
 }, 500);
 },
 function (next, results) {
 setTimeout(function () {
 console.log('done b');
 var result = 1000;
 next(result);
 console.log(results);
 }, 1000);
 },
 function (next, results) {
 setTimeout(function () {
 console.log('done c');
 var result = 1500;
 next(1500);
 console.log(results);
 }, 1500);
 }
 ],
 function (results) {
 var ret = 0, i = 0;
 for (; i < results.length; i++) {
 ret += results[i];
 }
 console.log('done all. result: ' + ret);
 }
 );*/
function Wait(fns, done) {
    var count = 0;
    var results = [];
    this.getCallback = function (index) {
        count++;
        return (function (waitback) {
            return function () {
                var i = 0, args = [];
                for (; i < arguments.length; i++) {
                    args.push(arguments[i]);
                }
                args.push(waitback);
                fns[index].apply(this, args);
            };
        })(function (result) {
            results.push(result);
            if (--count == 0) {
                done(results);
            }
        });
    }
}

var a = new Wait(
    [
        function (waitback) {
            console.log('done a');
            var result = 500;
            waitback(result)
        },
        function (waitback) {
            console.log('done b');
            var result = 1000;
            waitback(result)
        },
        function (waitback) {
            console.log('done c');
            var result = 1500;
            waitback(result)
        }
    ],
    function (results) {
        var ret = 0, i = 0;
        for (; i < results.length; i++) {
            ret += results[i];
        }
        console.log('done all. result: ' + ret);
    }
);
var callbacks = [a.getCallback(0), a.getCallback(1), a.getCallback(2), a.getCallback(1)];
setTimeout(callbacks[0], 500);
setTimeout(callbacks[1], 1000);
setTimeout(callbacks[2], 1500);
setTimeout(callbacks[3], 2000);