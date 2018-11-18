var testCase = require('nodeunit').testCase;
module.exports = testCase({
    "setUp": function (cb) {
        this.request = {
            headers: {
                Cookie: 'name1:val1; name2:val2'
            }
        };
        this.response = {};
        this.result = {name1: 'val1', name2: 'val2'};
        cb();
    },
    "tearDown": function (cb) {
        cb();
    },
    "normal_case": function (test) {
        test.expect(1);
        var obj = require('./tool').cookieParser(this.request, this.response);
        test.deepEqual(obj, this.result);
        test.done();
    }
});