// 新建
function createNotify() {
    var url = '~/modules/notify/edit_notify.jsp'
    $.open(url, 400, null, {}, function () {
        if ($.dialogReturnValue()) {
            notify_grid.refresh();
        }
    });
}

// 编辑
function editNotify(grid, rowData, keyData) {
    if (keyData) {
        var url = '~/notify/editNotifySubscribe.do?id=' + keyData;
        $.open(url, 400, null, {}, function () {
            if ($.dialogReturnValue()) {
                notify_grid.refresh();
            }
        });
    }
}

// 删除
function deleteNotify(grid, rowData, keyData) {
    if (keyData) {
        $.messageBox.confirm({
            message: "您确定要删除\"" + "\"该通知订阅配置吗？",
            callback: function (result) {
                if (result) {
                    $.dataservice("spring:notifyService.deleteNotify", {
                        notifyId: keyData
                    }, function (response) {
                        notify_grid.refresh();
                    });
                }
            }
        });
    }
}

// 发布者配置
function editInitialtor(grid, rowData, keyData) {
    if (keyData) {
        var notifyId = keyData;
        var type = 'initialtor';
        var initialtorMode = rowData['INITIALTOR_MODE'];
        switch (initialtorMode) {
            case 'user':
                editUser(notifyId, type);
                break;
            case 'role':
                editRole(notifyId, type);
                break;
            case 'org':
                editOrganization(notifyId, type);
                break;
            case 'telGroup':
                editTelephonistGroup(notifyId, type);
                break;
        }
    }
}

// 订阅者配置
function editRecipient(grid, rowData, keyData) {
    if (keyData) {
        var notifyId = keyData;
        var type = 'recipient';
        var recipientMode = rowData['RECIPIENT_MODE'];
        switch (recipientMode) {
            case 'user':
                editUser(notifyId, type);
                break;
            case 'role':
                editRole(notifyId, type);
                break;
            case 'org':
                editOrganization(notifyId, type);
                break;
            case 'telGroup':
                editTelephonistGroup(notifyId, type);
                break;
        }
    }
}

// 批量删除
function deleteNotifies() {
    var ids = notify_grid.getCheckedRowIds().split(',');

    if (ids == '') {
        $.messageBox.info({
            message: "请先选择要删除的通知订阅配置再点击删除操作!"
        });
        return;
    }

    $.messageBox.confirm({
        message: "您确定要移除所选择的通知订阅配置吗？",
        callback: function (result) {
            if (result) {
                var result = '';
                for (var i = 0; i < ids.length; i++) {
                    if (result != '')
                        result += ',';
                    result += notify_grid.getCellValue(ids[i],
                        'ID');
                }

                $.dataservice("spring:notifyService.deleteNotifies", {
                    notifyIds: result
                }, function (response) {
                    notify_grid.refresh();
                });
            }
        }
    });
}

function editUser(notifyId, type) {
    var url = '~/modules/notify/list_notify_user.jsp?notifyId=' + notifyId + '&type=' + type;
    $.open(url, 810, 480, function () {

    });
}

function editRole(notifyId, type) {
    var url = '~/modules/notify/list_notify_role.jsp?notifyId=' + notifyId + '&type=' + type;
    $.open(url, 810, 480, function () {

    });
}

function editOrganization(notifyId, type) {
    var url = '~/modules/notify/list_notify_organization.jsp?notifyId=' + notifyId + '&type=' + type;
    $.open(url, 810, 480, function () {

    });
}

function editTelephonistGroup(notifyId, type) {
    var url = '~/modules/notify/list_notify_telephonistGroup.jsp?notifyId=' + notifyId + '&type=' + type;
    $.open(url, 810, 480, function () {

    });
}