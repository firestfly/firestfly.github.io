/*
 *    var clock = new Clock();
 *    clock.onchange(function(time, timeStr) {
 *        s.time = timeStr;
 *    }).start();
 */
define(function(require, exports, module) {
    function Clock(opt) {
        var option = opt || {};
        var startIndex = 0,
            startTime = 0,
            endTime = 0,
            handle = null,
            dd = new Date(),
            changeFunc = option.onchange;

        function _format(s) {
            dd.setTime(s * 1000)
            return dd.toUTCString().slice(-12, -4)
                /*
                var h = ('00' + parseInt(s / 3600)).slice(-2)
                m = ('00' + parseInt(s / 60 % 60)).slice(-2)
                s = ('00' + parseInt(s % 60)).slice(-2)
                return [h, m, s].join(":");
                */
        }

        function _timeout() {
            changeFunc && changeFunc(startIndex, _format(startIndex))
            startIndex++;
            handle = setTimeout(_timeout, 1000)
        }

        this.start = function(startSecond) {
            clearTimeout(handle);
            startTime = new Date();
            startIndex = startSecond || 0;
            _timeout();
            return this;
        }

        this.stop = function() {
            endTime = new Date();
            clearTimeout(handle);
            return this;
        }
        this.onchange = function(func) {
            changeFunc = func;
            return this;
        }
        this.lag = function() {
            return endTime - startTime;
        }
    }
    return Clock;
})