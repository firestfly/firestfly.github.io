Type.registerNamespace('UMP.Logic.Method');

UMP.Logic.Method.Encryption = function () {

};

function UMP$Logic$Method$Encryption$md5(str, option) {
    var md;
    str = str || '';
    option.bits = option.bits || 32;
    option.capitalized = option.capitalized || 'lowercase';
    md = window.md5Encrypt.hex_md5(str);
    if (option.bits == 16) {
        md = md.substr(8, 16);
    }
    if (option.capitalized == "uppercase") {
        md = md.toUpperCase();
    }
    return md;
}

UMP.Logic.Method.Encryption.prototype = {
    md5: UMP$Logic$Method$Encryption$md5
}


UMP.Logic.Method.Encryption.registerClass('UMP.Logic.Method.Encryption');