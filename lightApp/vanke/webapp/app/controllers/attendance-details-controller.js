VkrmsApp.controller('AttendanceDetailsController', ['$scope', '$http', 'CommonService', '$routeParams', function ($scope, $http, commonService, $routeParams) {
    $scope.title = "万科资源管理信息系统 - 出勤详情";
    $scope.save = save;
    $scope.cancel = cancel;
    $scope.adjust = adjust;
    $scope.cancelAdjust = cancelAdjust;

    var attendanceDetails = [],
        attendanceId = $routeParams.attendance_id,
        edit = "",
        isShowAll = false,
        isShowAdjust = false,
        isShowCancel = false, //校正or取消校正
        addOrCancel = "";

    getAttendanceInfo();

    //获取某员工某天出勤信息
    function getAttendanceInfo() {
        $http({
            url: 'internal/api/attendances/' + attendanceId,
            method: 'GET'
        }).success(function (data) {
            if (data && data.status == "success") {
                $scope.personalInfoList = [
                    {filterCompanyName: data.result.departmentName},
                    {filterCompanyName: data.result.employeeName},
                    {filterCompanyName: data.result.attendanceDate}
                ];
                attendanceDetails = data.result.attendances;
                if (data.result.attendances == null || data.result.attendances == "[]") {
                    return false;
                }
                for (var i = 0; i < attendanceDetails.length; i++) {
                    attendanceDetails[i].attendanceTime = attendanceDetails[i].attendanceTime.substr(11, 8);
                    //是否有效
                    var isValidTmp = attendanceDetails[i].isValid;
                    if (isValidTmp == "0") {
                        attendanceDetails[i].isValid = "否";
                    } else if (isValidTmp == "1") {
                        attendanceDetails[i].isValid = "是";
                    }
                    //签到类型
                    var attendanceTypeTmp = attendanceDetails[i].attendanceType;
                    if (attendanceTypeTmp == "0") {
                        attendanceDetails[i].attendanceType = "住这儿签到";
                    } else if (attendanceTypeTmp == "1") {
                        attendanceDetails[i].attendanceType = "手动校正";
                    }
                    //操作
                    var adjustTime = "", adjustPersonName = "", adjustComment1 = "", adjustComment2 = "", adjustTime2 = "", adjustPersonName2 = "";
                    var adjustHistoryTmp = attendanceDetails[i].adjustHistory;
                    if (adjustHistoryTmp.length > 0) { //有校正记录
                        for (var j = 0; j < adjustHistoryTmp.length; j++) {
                            isShowAll = false;
                            isShowAdjust = false;
                            isShowCancel = false;
                            addOrCancel = "";
                            if (adjustHistoryTmp[j].adjustType == "0") {  //无效记录，已经校正
                                edit = "<a href='javascript:void(0)' class='edit-cancelAdjust'>取消校正</a>";
                                isShowAll = true;
                                isShowAdjust = true;
                                addOrCancel = "cancel";
                                adjustComment1 = adjustHistoryTmp[j].adjustComment;
                                adjustTime = adjustHistoryTmp[j].adjustTime;
                                adjustPersonName = adjustHistoryTmp[j].adjustPersonName;
                            } else if (adjustHistoryTmp[j].adjustType == "1") {  //无效记录，取消校正
                                edit = "<div>--</div>";
                                isShowAll = true;
                                isShowAdjust = true;
                                isShowCancel = true;
                                addOrCancel = "";
                                adjustComment2 = adjustHistoryTmp[j].adjustComment;
                                adjustTime2 = adjustHistoryTmp[j].adjustTime;
                                adjustPersonName2 = adjustHistoryTmp[j].adjustPersonName;
                            }
                        }
                    } else {
                        if (attendanceDetails[i].isValid == "是") {  //有效记录，不需校正
                            isShowAll = false;
                            isShowAdjust = false;
                            isShowCancel = false;
                            edit = "<div>--</div>";
                        } else if (attendanceDetails[i].isValid == "否") {  //无效记录，没有校正
                            isShowAll = false;
                            isShowAdjust = false;
                            isShowCancel = false;
                            edit = "<a href='javascript:void(0)' class='edit-adjust'>校正</a>";
                            addOrCancel = "add";
                        }
                    }

                    var arrTmp = [];
                    arrTmp.push("edit+" + edit);
                    arrTmp.push("isShowAll+" + isShowAll);
                    arrTmp.push("isShowAdjust+" + isShowAdjust);
                    arrTmp.push("isShowCancel+" + isShowCancel);
                    arrTmp.push("addOrCancel+" + addOrCancel);
                    arrTmp.push("adjustComment1+" + adjustComment1);
                    arrTmp.push("adjustTime+" + adjustTime);
                    arrTmp.push("adjustPersonName+" + "校正人：" + adjustPersonName);
                    arrTmp.push("adjustComment2+" + adjustComment2);
                    arrTmp.push("adjustTime2+" + adjustTime2);
                    arrTmp.push("adjustPersonName2+" + "取消校正人：" + adjustPersonName2);
                    for (var j = 0; j < arrTmp.length; j++) {
                        var arr = arrTmp[j].split("+");
                        attendanceDetails[i][arr[0]] = arr[1];
                    }
                }
                $scope.attendanceDetails = attendanceDetails;
            }
        }).error(function () {
            commonService.alert({
                content: "获取获取出勤信息失败，请重试",
                icon: "fa-exclamation-circle",
                iconColor: "icon-green"
            });
        });
    }

    //校正
    function adjust(attendanceDetailId) {
        for (var i = 0; i < attendanceDetails.length; i++) {
            if (attendanceDetails[i].attendanceDetailId == attendanceDetailId) {
                attendanceDetails[i].isShowAll = true;
                attendanceDetails[i].isShowComment = true;
                attendanceDetails[i].addOrCancel = "add";
                $scope.$apply();
                break;
            }
        }
    }

    //取消校正
    function cancelAdjust(attendanceDetailId) {
        for (var i = 0; i < attendanceDetails.length; i++) {
            if (attendanceDetails[i].attendanceDetailId == attendanceDetailId) {
                attendanceDetails[i].isShowAll = true;
                attendanceDetails[i].isShowComment = true;
                attendanceDetails[i].adjustComment = "";
                attendanceDetails[i].addOrCancel = "cancel";
                $scope.$apply();
                break;
            }
        }
    }

    $(document).on('click', '.edit-adjust', function () {
        adjust($(this).parent().siblings().eq(0).html());
    });
    $(document).on('click', '.edit-cancelAdjust', function () {
        cancelAdjust($(this).parent().siblings().eq(0).html());
    });

    //保存
    function save(attendanceDetail) {
        if (attendanceDetail.adjustComment.length <= 0) {
            commonService.alert({
                content: "校正理由不能为空，请重试",
                icon: "fa-exclamation-circle",
                iconColor: "icon-green"
            });
            return false;
        } else if (attendanceDetail.adjustComment.length > 100) {
            commonService.alert({
                content: "校正理由超过最大字符数，请重试",
                icon: "fa-exclamation-circle",
                iconColor: "icon-green"
            });
            return false;
        }
        var postHttp = "", CommentData = {"adjustComment": attendanceDetail.adjustComment};
        if (attendanceDetail.addOrCancel == "add") {
            postHttp = 'internal/api/attendances/adjust/attendance-detail-id/';
        } else if (attendanceDetail.addOrCancel == "cancel") {
            postHttp = 'internal/api/attendances/cancel-adjust/attendance-detail-id/';
        }
        $http({
            url: postHttp + attendanceDetail.attendanceDetailId,
            method: 'Post',
            data: CommentData
        }).success(function (data) {
            if (data && data.status == "success") {
                attendanceDetail.isShowComment = false;
                attendanceDetail.isShowAll = true;
                if (attendanceDetail.addOrCancel == "add") {
                    attendanceDetail.isShowAdjust = true;
                    attendanceDetail.adjustComment1 = attendanceDetail.adjustComment;
                    attendanceDetail.adjustPersonName = "校正人：" + data.result.adjustPersonName;
                    attendanceDetail.adjustTime = data.result.adjustTime;
                    attendanceDetail.attendanceType = "手动校正";
                    attendanceDetail.edit = "<a href='javascript:void(0)' class='edit-cancelAdjust'>取消校正</a>"
                } else if (attendanceDetail.addOrCancel == "cancel") {
                    attendanceDetail.isShowCancel = true;
                    attendanceDetail.adjustComment2 = attendanceDetail.adjustComment;
                    attendanceDetail.adjustPersonName2 = "取消校正人：" + data.result.adjustPersonName;
                    attendanceDetail.adjustTime2 = data.result.adjustTime;
                    attendanceDetail.attendanceType = "助这儿签到";
                    attendanceDetail.edit = "<div>--</div>";
                }
            }
        }).error(function () {
            commonService.alert({
                content: "保存失败，请重试",
                icon: "fa-exclamation-circle",
                iconColor: "icon-green"
            });
        });
    }

    //取消
    function cancel(attendanceDetail) {
        attendanceDetail.isShowComment = false;
        if ((attendanceDetail.isShowComment == false || attendanceDetail.isShowComment == "false") && (attendanceDetail.isShowAdjust == false || attendanceDetail.isShowAdjust == "false") && (attendanceDetail.isShowCancel == false || attendanceDetail.isShowCancel == "false")) {
            attendanceDetail.isShowAll = false;
        }
    }

}]);