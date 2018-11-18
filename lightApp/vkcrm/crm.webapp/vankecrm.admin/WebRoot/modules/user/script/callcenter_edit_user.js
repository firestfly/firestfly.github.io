/**
 * 新增修改话务员JS文件
 *
 */

var skillList;

var telecomnoLength = 0;


$(function () {
    // 输入框控件初始化
    $('.inputimg').input({
        type: 'class',// 样式背景渲染
        src: 'icon-search',// class 来自与 icon.css
        title: '查询分组',
        event: {
            click: function (val, input) {
                selectClz();
            }
        }
    });

    // 加载职务下拉框，技能下拉框，技能数据
    $.dataservice("spring:callcenterUserService.getTelecomno", {userId: userId}, function (response) {
        var dutySelect = document.getElementById('dutyId');
        var telephonistDuty = response.details.telephonistDuty;
        for (var i = 0; i < telephonistDuty.length; i++) {
            addOption(dutySelect, telephonistDuty[i].code + ":" + telephonistDuty[i].value, telephonistDuty[i].value);
        }
        if (dutyId != '') {
            dutySelect.value = dutyId;
        }
        skillList = response.details.skillList;
        var userSkillList = response.details.userSkillList;
        for (var i = 0; i < userSkillList.length; i++) {
            addUserTelecomno(userSkillList[i].number, userSkillList[i].skillid);
        }
        if (response.details.secUser) {
            document.getElementById('loginId').value = response.details.secUser.loginId;
        }
    });
});


// 添加一个技能
function addUserTelecomno(number, skillId) {
    telecomnoLength = telecomnoLength + 1;
    var row = '<div id="' + telecomnoLength + '"><b>电信工号：</b>';
    row += '<input type="text" name="telecomnoId" data-validator="required[“电信工号”不能为空。]" maxlength="10" style="width: 180px;" value="' + number + '" class="input-large"/>';
    row += '<b>技能名称：</b>';
    row += '<select name="skillId" data-validator="required[“技能名称”不能为空。]" style="width:180px;">';
    for (var i = 0; i < skillList.length; i++) {
        if (skillList[i].id == skillId) {
            row += '<option value="' + skillList[i].id + '" selected="selected">' + skillList[i].name + '</option>';
        } else {
            row += '<option value="' + skillList[i].id + '">' + skillList[i].name + '</option>';
        }
    }
    row += '</select>'
    row += '<img src="' + Global.serverPath + '/statics/images/icons/button-remove.png" alt="删除" onclick="removeTelecomno(' + telecomnoLength + ')" /></div>';
    var telecomnoList = $("#telecomnoList");
    telecomnoList.append(row);
}

/** 删除一个技能 */
function removeTelecomno(divId) {
    $("#" + divId).remove();
}

/** 添加一个下拉项 */
function addOption(select_, value_, text_) {
    var op = document.createElement("option");      // 新建OPTION (op)
    op.setAttribute("value", value_);          // 设置OPTION的 VALUE
    op.appendChild(document.createTextNode(text_)); // 设置OPTION的 TEXT
    select_.appendChild(op);           // 为SELECT 新建一 OPTION(op)
}


/**
 * 处理保存按钮动作
 */
function doSave() {
    // 验证表单
    var valInfo = $.validation.validate("#SEC_USER_FOMR");
    if (valInfo.isError) {
        return;
    }
    var user = $('#SEC_USER_FOMR').toJson();

    var telecomnoIds = document.getElementsByName('telecomnoId');
    var skillIds = document.getElementsByName('skillId');
    if (telecomnoIds.length < 1) {
        $.messageBox.info({message: '“电信工号”必须填写！'});
        return;
    }
    var telecomnoIdArr = [];
    var skillIdArr = [];

    for (var i = 0; i < telecomnoIds.length; i++) {
        telecomnoIdArr[i] = telecomnoIds[i].value;
        skillIdArr[i] = skillIds[i].value;
        if (telecomnoIds[i].value == '' || skillIds[i].value == '') {
            $.messageBox.info({message: '“电信工号”必须填写！'});
            return;
        }
    }
    user.telecomnoId = telecomnoIdArr.join(',');
    user.skillId = skillIdArr.join(',');

    // 保存话务员信息
    $.dataservice("spring:callcenterUserService.saveOrUpdate", user, function (response) {
        if (response.success) {
            $.messageBox.info({message: response.details});
            $.dialogReturnValue(true);
            $(document).dialogClose();
        } else {
            $.messageBox.info({message: response.message});
        }
    });
}

function showCheckPassword() {
    document.getElementById('checkPassTh').style.display = '';
    document.getElementById('checkPassTd').style.display = '';
    document.getElementById('hideTd').style.display = 'none';
}

function checkUniqueAccount() {
    var loginId = document.getElementById('loginId').value;
    var exprStr = /^[a-zA-Z0-9_]{1,38}$/;
    if (!exprStr.test(loginId)) {
        return {isError: true, errorInfo: "话务员编码由字母、数字、下划线组成"};
    } else {
        return {isError: false};
    }
}

// 加载分组下拉框
function selectClz() {
    $.listselectdialog({
        valueField: '#groups',
        labelField: '#groupNames',
        key: {value: 'id', label: 'text'},
        multi: true,
        tree: {
            title: '选择话务员分组',
            method: 'post',
            asyn: false,
            rootId: 'root',
            rootText: '万科物业',
            CommandName: 'java.tree.command',
            cascadeCheck: false, //级联选择，UP向上级联 DOWN向下级联 false不级联 true向上向下级联
            expandLevel: 3,
            params: {
                daoBeanName: 'callCenterDao',
                sqlId: 'callcenter.organization.tree'
            }
        }
    });
}

function checkNewPassword() {
    var patternStr = /^[0-9]{6,40}$/;
    if (patternStr.test($F('password'))) {
        return false;
    }
    var len = $F('password').length;
    return len >= 6 && len <= 40;
}