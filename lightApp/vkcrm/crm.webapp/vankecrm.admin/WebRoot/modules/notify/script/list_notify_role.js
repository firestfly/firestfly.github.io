// 删除
function deleteRole(grid, rowData, keyData) {
    if (keyData) {
        var roleName = rowData['ROLE_NAME'];
        $.messageBox.confirm({
            message: "您确定要删除\"" + roleName
            + "\"角色吗？",
            callback: function (result) {
                $.dataservice("spring:notifyService.deleteNotifyRole", {
                    notifyId: notifyId,
                    roleId: keyData,
                    type: type
                }, function (response) {
                    notify_role_grid.refresh();
                });
            }
        });
    }
}

// 批量删除
function deleteRoles() {
    var ids = notify_role_grid.getCheckedRowIds().split(',');

    if (ids.length == 0 || ids[0] == '') {
        $.messageBox.warning({
            message: "请选择需要删除的角色!"
        });
        return;
    }

    $.messageBox.confirm({
        message: "您确定要删除所选择的角色吗？",
        callback: function (result) {
            if (result) {
                var result = '';
                for (var i = 0; i < ids.length; i++) {
                    if (result != '')
                        result += ',';
                    result += notify_role_grid.getCellValue(ids[i],
                        'ROLE_ID');
                }

                $.dataservice("spring:notifyService.deleteNotifyRoles", {
                    notifyId: notifyId,
                    roleIds: result,
                    type: type
                }, function (response) {
                    notify_role_grid.refresh();
                });
            }
        }
    });
}

function resetForm(){
    $('#queryForm')[0].resetForm();
}

//添加角色信息
function addRoles() {
    $.listselectdialog({
        title: '角色选择',
        key: {
            value: 'ID',
            label: 'NAME'
        },
        multi: true,
        grid: {
            title: "角色列表",
            limit: 10,
            params: {
                sqlId: 'notify.get.role',
                notifyId: notifyId,
                type: type
            },
            CommandName: 'java.page.command',
            columns: [{
                align: "center",
                key: "NAME",
                label: "角色名称",
                query: true,
                width: "100"
            },
                {
                    align: "center",
                    key: "ROLE_DESCRIPTION",
                    label: "角色描述",
                    query: true,
                    width: "150"
                }]
        }
    }, function () {
        var result = jQuery.dialogReturnValue();
        if (!result) {
            return;
        }
        $.dataservice("spring:notifyService.addNotifySubscribeRole", {
            notifyId: notifyId,
            roleIds: result.value,
            type: type
        }, function (response) {
            notify_role_grid.refresh();
        });
    });
}