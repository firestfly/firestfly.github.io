module.exports = function (funs) {
    var c = 0;
    if (!isArrayOfFunctions(funs)) {
        throw('Argument type was not matched. Should be array of functions.');
    }
    return function () {
        var args = Array.prototype.slice.call(arguments, 0);
        if (!(c >= funs.length)) {
            c++;
            return funs[c - 1].apply(this, args);
        }
    };
}

function isArrayOfFunctions(f) {
    if (typeof f !== 'object') return false;
    if (!f.length) return false;
    if (!f.concat) return false;
    if (!f.splice) return false;
    var i = 0;
    for (; i < f.length; i++) {
        if (typeof f[i] !== 'function') return false;
    }
    return true;
}