var getCurrentDate = (function() {
    var d = new Date(),
        year = d.getFullYear(),
        month = d.getMonth() + 1,
        day = d.getDate(),
        date = year + "年" + month + "月" + day + "日";
    return {
        year: year,
        month: month,
        day: day,
        date: date
    }
})();

function date2str(x, y) {
    if (typeof x === "string") x = new Date(x);
    var z = {
        y: x.getFullYear(),
        M: x.getMonth() + 1,
        d: x.getDate(),
        h: x.getHours(),
        m: x.getMinutes(),
        s: x.getSeconds()
    };
    return y.replace(/(y+|M+|d+|h+|m+|s+)/g, function(v) {
        return ((v.length > 1 ? "0" : "") + eval('z.' + v.slice(-1))).slice(-(v.length > 2 ? v.length : 2))
    });
}
var currentDate = date2str(new Date(), "yyyy-M-d");
var ajaxUrlConfig = {
    decorationRecord: path.server + "/api/decorationRecord",
    constructionCertificate: path.server +  "/api/constructionCertificate",
    printLog: path.server + "/api/decorationLog"
}
var sizeof = function(str, charset) {
    var total = 0,
        charCode,
        i,
        len;
    charset = charset ? charset.toLowerCase() : '';
    if (charset === 'utf-16' || charset === 'utf16') {
        for (i = 0, len = str.length; i < len; i++) {
            charCode = str.charCodeAt(i);
            if (charCode <= 0xffff) {
                total += 2;
            } else {
                total += 4;
            }
        }
    } else {
        for (i = 0, len = str.length; i < len; i++) {
            charCode = str.charCodeAt(i);
            if (charCode <= 0x007f) {
                total += 1;
            } else if (charCode <= 0x07ff) {
                total += 2;
            } else if (charCode <= 0xffff) {
                total += 3;
            } else {
                total += 4;
            }
        }
    }
    return total;
}

var validate = function() {
    var pattern = avalon(this).attr("pattern");
    $(this).val($(this).val().trim());
    if (this.value && pattern && !new RegExp(pattern).test(this.value)) {
        $(this).addClass("input-invalidate");
        var tips = $(this).data("errtips");
        if(tips) {
            $.prompt(tips, {
                title: "提示",
                timeout: 2000,
                buttons: { "确定": false }
            });
        }
    } else if (sizeof(this.value) > 150) {
        $.prompt("文字输入过长", {
            title: "提示",
            timeout: 2000,
            buttons: { "确定": false }
        });
        $(this).addClass("input-invalidate");
    } else {
        $(this).removeClass("input-invalidate");
    }
}

function removeInval(){
    $(this).removeClass('input-invalidate');
}
function addInval(){
    $(this).addClass('input-invalidate');
}
