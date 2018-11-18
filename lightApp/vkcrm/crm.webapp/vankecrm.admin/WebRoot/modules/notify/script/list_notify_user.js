// 删除单个用户
function deleteUser(grid, rowData, keyData) {
    var userName = rowData['USER_NAME'];
    $.messageBox.confirm({
        message: "您确定将\"" + userName + "\"用户从中移除掉吗？",
        callback: function (result) {
            $.dataservice("spring:notifyService.deleteNotifyUser", {
                notifyId: notifyId,
                userId: keyData,
                type: type
            }, function () {
                notify_user_grid.refresh();
            });

        }
    });
}

// 批量删除用户
function deleteUsers() {
    var ids = notify_user_grid.getCheckedRowIds().split(',');

    if (ids == '') {
        $.messageBox.warning({
            message: "请先选择要删除的用户再点击删除操作!"
        });
        return;
    }

    $.messageBox.confirm({
        message: "您确定要移除所选择的用户吗？",
        callback: function (result) {
            if (result) {
                var result = '';
                for (var i = 0; i < ids.length; i++) {
                    if (result != '')
                        result += ',';
                    result += notify_user_grid.getCellValue(ids[i],
                        'USER_ID');
                }

                $.dataservice("spring:notifyService.deleteNotifyUsers", {
                    notifyId: notifyId,
                    userIds: result,
                    type: type
                }, function (response) {
                    notify_user_grid.refresh();
                });
            }
        }
    });
}

function resetForm(){
    $('#queryForm')[0].resetForm();
}

//添加人员信息
function addUsers() {
    $.listselectdialog({
        title: '用户选择',
        key: {
            value: 'ID',
            label: 'NAME'
        },
        multi: true,
        tree: {
            title: '组织机构',
            method: 'post',
            asyn: false,
            rootId: 'root',
            rootText: '组织机构',
            CommandName: 'java.tree.command',
            expandLevel: 3,
            params: {
                sqlId: 'organization.tree'
            },
            gridKey: "ORG_ID"
        },
        grid: {
            title: "用户列表",
            limit: 10,
            params: {
                sqlId: 'notify.get.user',
                notifyId: notifyId,
                type: type
            },
            CommandName: 'java.page.command',
            columns: [{
                align: "center",
                key: "LOGIN_ID",
                label: "登录账号",
                query: true,
                width: "100"
            }, {
                align: "center",
                key: "NAME",
                label: "用户姓名",
                query: true,
                width: "100"
            }, {
                align: "center",
                key: "DEP",
                label: "所属项目",
                query: true,
                width: "250",
                align: "left"
            }]
        }
    }, function () {
        var result = jQuery.dialogReturnValue();
        if (!result) {
            return;
        }
        $.dataservice("spring:notifyService.addNotifySubscribeUser", {
            notifyId: notifyId,
            type: type,
            userIds: result.value
        }, function (response) {
            notify_user_grid.refresh();
        });
    });
}