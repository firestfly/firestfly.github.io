// 删除
function deleteTelephonistGroup(grid, rowData, keyData) {
    if (keyData) {
        var telephonistGroupName = rowData['NAME'];
        $.messageBox.confirm({
            message: "您确定要删除\"" + telephonistGroupName
            + "\"组织吗？",
            callback: function (result) {
                $.dataservice("spring:notifyService.deleteNotifyTelephonistGroup", {
                    notifyId: notifyId,
                    telephonistGroupId: keyData,
                    type: type
                }, function (response) {
                    notify_telephonistGroup_grid.refresh();
                });
            }
        });
    }
}

// 批量删除
function deleteTelephonistGroups() {
    var ids = notify_telephonistGroup_grid.getCheckedRowIds().split(',');

    if (ids.length == 0 || ids[0] == '') {
        $.messageBox.warning({
            message: "请选择需要删除的话务分组!"
        });
        return;
    }

    $.messageBox.confirm({
        message: "您确定要删除所选择的话务分组吗？",
        callback: function (result) {
            if (result) {
                var result = '';
                for (var i = 0; i < ids.length; i++) {
                    if (result != '')
                        result += ',';
                    result += notify_telephonistGroup_grid.getCellValue(ids[i],
                        'ID');
                }

                $.dataservice("spring:notifyService.deleteNotifyTelephonistGroups", {
                    notifyId: notifyId,
                    telephonistGroupIds: result,
                    type: type
                }, function (response) {
                    notify_telephonistGroup_grid.refresh();
                });
            }
        }
    });
}

function resetForm(){
    $('#queryForm')[0].resetForm();
}

//添加角色信息
function addTelephonistGroups() {
    $.listselectdialog({
        title: '话务分组选择',
        key: {
            value: 'ID',
            label: 'NAME'
        },
        multi: true,
        grid: {
            title: "话务分组列表",
            limit: 10,
            params: {
                sqlId: 'notify.get.telephonistGroup',
                notifyId: notifyId,
                type: type
            },
            CommandName: 'java.page.command',
            columns: [{
                align: "center",
                key: "NAME",
                label: "话务分组名称",
                query: true,
                width: "100"
            }]
        }
    }, function () {
        var result = jQuery.dialogReturnValue();
        if (!result) {
            return;
        }
        $.dataservice("spring:notifyService.addNotifySubscribeTelephonistGroup", {
            notifyId: notifyId,
            telephonistGroupIds: result.value,
            type: type
        }, function (response) {
            notify_telephonistGroup_grid.refresh();
        });
    });
}