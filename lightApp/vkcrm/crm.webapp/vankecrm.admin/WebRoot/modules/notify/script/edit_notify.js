var recipientMode = 'user', initialtorMode = 'user';
//是否配置订阅者
var isRecipient = true;
$(function () {
    //init();
    //配置发布者
    $('#editInitialtor').click(function (e) {
        if (notifyId === '') {
            $.messageBox.info({message: '请先保存通知配置基本信息之后再进行发布者配置.'});
            return;
        }
        isRecipient = false;
        switch (initialtorMode) {
            case 'user':
                editUser();
                break;
            case 'role':
                editRole();
                break;
            case 'org':
                editOrganization();
                break;
            case 'telGroup':
                editTelephonistGroup();
                break;
        }
    });
    //配置订阅者
    $('#editRecipient').click(function (e) {
        if (notifyId === '') {
            $.messageBox.info({message: '请先保存通知配置基本信息之后再进行订阅者配置.'});
            return;
        }
        isRecipient = true;
        switch (recipientMode) {
            case 'user':
                editUser();
                break;
            case 'role':
                editRole();
                break;
            case 'org':
                editOrganization();
                break;
            case 'telGroup':
                editTelephonistGroup();
                break;
        }
    });
});

function init(){
    if (notifyId !== '') {
        $('#editRecipient').attr('disabled', false);
        $('#editInitialtor').attr('disabled', false);
    }
}

//选择订阅者类型
function onRecipientModeChange() {
    //$('#editRecipient').attr('disabled', false);
    var value = $('#recipientMode option:selected').val();
    recipientMode = value;
    if (notifyId !== '') {
        //$.messageBox.info({message: '您已修改了订阅者类型,请重新配置订阅者信息或者取消修改,谢谢.'});
        alert('您已修改了订阅者类型,请保存之后再重新配置订阅者信息或者取消关闭,谢谢.');
    }
}

//选择发布者类型
function onInitialtorModeChange() {
    //$('#editInitialtor').attr('disabled', false);
    var value = $('#initialtorMode option:selected').val();
    initialtorMode = value;
    if (notifyId !== '') {
        //$.messageBox.info({message: '您已修改了订阅者类型,请重新配置发布者信息或者取消修改,谢谢.'});
        alert('您已修改了订阅者类型,请保存之后再重新配置发布者信息或者取消关闭,谢谢.');
    }
}

function doSave() {
    var valInfo = $.validation.validate("#NOTIFY_EDIT_FORM");
    if (valInfo.isError)
        return;
    var notifySubscribe = $('#NOTIFY_EDIT_FORM').toJson();
    $.dataservice("spring:notifyService.saveOrUpdate", notifySubscribe, function (response) {
        $.dialogReturnValue(true);
        notifyId = response;
        $.messageBox.info({message: '保存成功,请进行进行发布者,订阅者配置.'});
        $('#editRecipient').attr('disabled', false);
        $('#editInitialtor').attr('disabled', false);
        $(document).dialogClose();
    });
}

function doUpdate(){
    var valInfo = $.validation.validate("#NOTIFY_EDIT_FORM");
    if (valInfo.isError)
        return;
    var notifySubscribe = $('#NOTIFY_EDIT_FORM').toJson();
    $.dataservice("spring:notifyService.saveOrUpdate", notifySubscribe, function (response) {
        $.dialogReturnValue(true);
        notifyId = response;
        $.messageBox.info({message: '更新成功,请进行进行发布者,订阅者配置.'});
        $('#editRecipient').attr('disabled', false);
        $('#editInitialtor').attr('disabled', false);
        $(document).dialogClose();
    });
}

function editUser() {
    var url = '~/modules/notify/list_notify_user.jsp?notifyId=' + notifyId + '&type=' + (isRecipient == true ? 'recipient' : 'initialtor');
    $.open(url, 810, 480, function () {

    });
}

function editRole() {
    var url = '~/modules/notify/list_notify_role.jsp?notifyId=' + notifyId + '&type=' + (isRecipient == true ? 'recipient' : 'initialtor');
    $.open(url, 810, 480, function () {

    });
}

function editOrganization() {
    var url = '~/modules/notify/list_notify_organization.jsp?notifyId=' + notifyId + '&type=' + (isRecipient == true ? 'recipient' : 'initialtor');
    $.open(url, 810, 480, function () {

    });
}

function editTelephonistGroup() {
    var url = '~/modules/notify/list_notify_telephonistGroup.jsp?notifyId=' + notifyId + '&type=' + (isRecipient == true ? 'recipient' : 'initialtor');
    $.open(url, 810, 480, function () {

    });
}
