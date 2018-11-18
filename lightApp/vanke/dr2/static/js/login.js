//不让该页面嵌入其他框架页面
window.onload = function initForm() { //登录界面不嵌入到任何子页面
    var loginName = getCookie('username');
    if (loginName && loginName != '') {
        document.getElementById('username').value = aesDecrypt(loginName);
    }

    //初始化焦点
    if (document.getElementById('username').value == '') {
        document.getElementById('username').focus();
    } else {
        document.getElementById('password').focus();
    }
};

var aesKey = '0102030405060708';

/**
 * 加密数据
 * @param {type} data 待加密的字符串
 * @param {type} keyStr 秘钥
 * @param {type} ivStr 向量
 * @returns {unresolved} 加密后的数据
 */
var aesEncrypt = function(data) {
    var postData = CryptoJS.enc.Utf8.parse(data);
    var key = CryptoJS.enc.Utf8.parse(aesKey);
    var iv = CryptoJS.enc.Utf8.parse(aesKey);
    var encrypted = CryptoJS.AES.encrypt(postData, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC
    });
    return encrypted.toString();
};

/**
 * 
 * @param {type} data BASE64的数据
 * @param {type} key 解密秘钥
 * @param {type} iv 向量
 * @returns {undefined} 
 */
var aesDecrypt = function(data) {
    var key = CryptoJS.enc.Utf8.parse(aesKey);
    var iv = CryptoJS.enc.Utf8.parse(aesKey);
    //解密的是基于BASE64的数据，此处data是BASE64数据
    var decrypted = CryptoJS.AES.decrypt(data, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
};

function refresh(obj) {
    obj.src = Config.serverPath + '/validateimg.jpg' + '?code= ' + Math.random();;
}

//记录登录信息
function saveLoginInfo() {
    setCookie('username', document.getElementById('username_post').value, 30);
}

function doSubmit() {
    //document.getElementById('username_post').value = aesEncrypt(document.getElementById('username').value);
    //document.getElementById('password_post').value = aesEncrypt(document.getElementById('password').value);

    document.getElementById('username_post').value = aesEncrypt(document.getElementById('username').value);
    document.getElementById('password_post').value = aesEncrypt(document.getElementById('password').value);
    saveLoginInfo();
    document.forms[0].submit();
    return true;
}

//回车提交事件
function keyFunction() {
    if (event.keyCode == 13) {
        doSubmit();
    }
}

function setCookie(objName, objValue, objDays) { //添加cookie 
    var str = objName + "=" + objValue;
    if (objDays > 0) { //为0时不设定过期时间，浏览器关闭时cookie自动消失 
        var date = new Date();
        var ms = objDays * 24 * 3600 * 1000;
        date.setTime(date.getTime() + ms);
        str += "; expires=" + date.toGMTString();
    }
    document.cookie = str;
}

function getCookie(cookieName) { //自定义函数    	
    var cookieString = document.cookie; //获取cookie
    var start = cookieString.indexOf(cookieName + '='); //截取cookie的名
    if (start == -1) //若不存在该名字的 cookie
        return null; //返回空值
    start += cookieName.length + 1;
    var end = cookieString.indexOf(';', start);
    if (end == -1) //防止最后没有加“;”冒号的情况
        return cookieString.substring(start); //返回cookie值
    return cookieString.substring(start, end); //返回cookie值
}