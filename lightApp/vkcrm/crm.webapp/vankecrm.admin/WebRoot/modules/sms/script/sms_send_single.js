/**
 * 新增修改话务员JS文件
 *
 */

var arrayStatic;
var contentArrayMain = new Array();


var xxxx = '\u00D7';//XXXX替换符号

$(function () {


});

/**
 * 点击行事件，更新模板内容
 * @param {} grid
 * @param {} rowData
 * @param {} keyData
 */
function onRowClick(rowIndex, colIndex) {

    // 获取点击模板的值
    var id = user_grid.getCellValue(rowIndex, "id");
    var type = user_grid.getCellValue(rowIndex, "type");
    var content = user_grid.getCellValue(rowIndex, "content");

    $.messageBox.confirm({
        message: "是否替换模板？",
        callback: function (result) {
            if (result == true) {
                // 设置模板信息
                document.getElementById('type').value = type;
                document.getElementById('templateId').value = id;

                if (type == 1) {//固定模板不可编辑
                    document.getElementById('sendContent').readOnly = 'readonly';
                    document.getElementById('templateContent').innerText = '';
                    document.getElementById('sendContent').value = content;
                } else {// 半自定义模板在×××后面显示字符串
                    document.getElementById('sendContent').readOnly = '';
                    document.getElementById('sendContent').value = content;//设置输入框值
                    var contentTemp = content;//×您好！×谢谢使用本系统×，欢迎下次使用×
                    contentArrayMain = new Array();
                    var k = 0;//转换后的字符串数组，k数组下表
                    for (var i = 0; i < 10; i++) {//将××长度压缩为1，方便拆分
                        contentTemp = contentTemp.replace(/\u00D7\u00D7/g, xxxx);
                    }
                    //alert('content = '+ content);
                    arrayStatic = contentTemp.split(xxxx);//固定文字
                    var index = 0;
                    for (var i = 0; i < arrayStatic.length; i++) {
                        if (i == 0 && arrayStatic[i] == '') {//第一个可能为空，不处理
                            continue;
                        }
                        if (arrayStatic[i] == '') {//最后一个可能为空
                            contentArrayMain[k++] = content.substring(0, content.length);//添加变量
                        } else {
                            contentArrayMain[k++] = content.substring(0, content.indexOf(arrayStatic[i]));//添加变量
                            contentArrayMain[k++] = arrayStatic[i];//添加常量
                            index = content.indexOf(arrayStatic[i]) + arrayStatic[i].length;
                            content = content.substring(index, content.length);
                        }
                    }
                    contentOnchange();
                }
            }
        }
    });
}

/**
 * 编辑中动态设置输入字符数
 */
function contentOnchange() {
    var content = document.getElementById('sendContent').value;//读取短信内容
    var contentArray = new Array(), k = 0;//转换后的字符串数组，k数组下表
    var index = 0;
    for (var i = 0; i < arrayStatic.length; i++) {
        if (i == 0 && arrayStatic[i] == '') {//第一个可能为空，不处理
            continue;
        }
        if (arrayStatic[i] == '') {//最后一个可能为空
            contentArray[k++] = content.substring(0, content.length);//添加变量
        } else {
            if (content.substring(0, content.length).indexOf(arrayStatic[i]) < 0) {
                break;
            }
            contentArray[k++] = content.substring(0, content.indexOf(arrayStatic[i]));//添加变量
            contentArray[k++] = arrayStatic[i];//添加常量
            index = content.indexOf(arrayStatic[i]) + arrayStatic[i].length;
            content = content.substring(index, content.length);
        }
    }

    var isOverflow = false;
    if (contentArray.length == contentArrayMain.length) {
        var contentNew = '';//在×××后面加上()如 = ××××(4/4)您好！×××××××××(9/9)谢谢使用本系统×(1/1)，欢迎下次使用×××(3/3)
        for (var i = 0; i < contentArrayMain.length; i++) {
            if (contentArrayMain[i] == '') {
                continue;
            }
            if (contentArrayMain[i].indexOf(xxxx) >= 0) {
                var len = contentArray[i].match(/[^ -~]/g) == null ? contentArray[i].length : contentArray[i].length + contentArray[i].match(/[^ -~]/g).length;
                contentNew += '(' + (len / 2) + '/' + contentArrayMain[i].length + ')';
                if (len / 2 > contentArrayMain[i].length) {
                    isOverflow = true;
                }
            } else {
                contentNew += contentArrayMain[i];
                if (!contentArray[i] || contentArrayMain[i] != contentArray[i]) {
                    isOverflow = true;
                }
            }
        }
        document.getElementById('templateContent').innerText = contentNew;
    } else {//结构发生变化，不能发送
        isOverflow = true;
    }
    if (isOverflow) {//如果文字溢出，将文本设置为红色
        document.getElementById('templateContent').style.color = 'red';
    } else {
        document.getElementById('templateContent').style.color = 'black';
    }
    return isOverflow;
}


/**
 * 处理保存按钮动作
 */
function doSend() {
    var message = $('#sendForm').toJson();
    message.content = message.sendContent;
    if (message.type == '' || (message.type == 2 && contentOnchange())) {
        $.messageBox.info({message: '短信和模板不匹配，不能发送。'});
        return;
    }
    if (message.content.indexOf(xxxx) >= 0) {
        $.messageBox.info({message: '短信内容不能带“' + xxxx + '”。'});
        return;
    }

    // 验证表单
    var valInfo = $.validation.validate("#sendForm");
    if (valInfo.isError) {
        return;
    }

    /** 发送短信
     Common.ajax({
        url: window.servicePath["tel"]+'/v1/message/send',
        type: "post",
        data: message,
        success: function (res) {
            if (res.success) {
                $.messageBox.info({message :res.details});
            }else{
                $.messageBox.info({message :res.message});
            }
        },
        error: function () {
        },
        complete: function () {
        }
    })**/
        // 发送短信
    $.dataservice("spring:messageService.sendMessage", message, function (res) {
        if (res.success) {
            $.messageBox.info({message: res.details});
        } else {
            $.messageBox.info({message: res.message});
        }
    });
}


