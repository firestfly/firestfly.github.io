// 删除
function deleteOrganization(grid, rowData, keyData) {
    if (keyData) {
        var organizationName = rowData['NAME'];
        $.messageBox.confirm({
            message: "您确定要删除\"" + organizationName
            + "\"组织吗？",
            callback: function (result) {
                $.dataservice("spring:notifyService.deleteNotifyOrganization", {
                    notifyId: notifyId,
                    organizationId: keyData,
                    type: type
                }, function (response) {
                    notify_organization_grid.refresh();
                });
            }
        });
    }
}

// 批量删除
function deleteOrganizations() {
    var ids = notify_organization_grid.getCheckedRowIds().split(',');

    if (ids.length == 0 || ids[0] == '') {
        $.messageBox.warning({
            message: "请选择需要删除的组织!"
        });
        return;
    }

    $.messageBox.confirm({
        message: "您确定要删除所选择的组织吗？",
        callback: function (result) {
            if (result) {
                var result = '';
                for (var i = 0; i < ids.length; i++) {
                    if (result != '')
                        result += ',';
                    result += notify_organization_grid.getCellValue(ids[i],
                        'ID');
                }

                $.dataservice("spring:notifyService.deleteNotifyOrganizations", {
                    notifyId: notifyId,
                    organizationIds: result,
                    type: type
                }, function (response) {
                    notify_organization_grid.refresh();
                });
            }
        }
    });
}

function resetForm(){
    $('#queryForm')[0].resetForm();
}

//添加角色信息
function addOrganizations() {
    $.listselectdialog({
        title: '组织选择',
        key: {
            value: 'ID',
            label: 'NAME'
        },
        multi: true,
        height: 800,
        grid: {
            title: "组织列表",
            limit: 10,
            params: {
                sqlId: 'notify.get.organization',
                notifyId: notifyId,
                type: type
            },
            CommandName: 'java.page.command',
            columns: [{
                align: "center",
                key: "NAME",
                label: "组织名称",
                query: true,
                width: "100"
            }]
        }
    }, function () {
        var result = jQuery.dialogReturnValue();
        if (!result) {
            return;
        }
        $.dataservice("spring:notifyService.addNotifySubscribeOrganization", {
            notifyId: notifyId,
            organizationIds: result.value,
            type: type
        }, function (response) {
            notify_organization_grid.refresh();
        });
    });
}