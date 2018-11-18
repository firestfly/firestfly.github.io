//主页TAB切换
jQuery(document).ready(function () {
    loadNotPayCustomers(1);
   
    /** 上传文件 此方式IE8不兼容，提示下载文件
    var options = {
        target: '#ajaxFormCallback',
        beforeSubmit: function () {
        },
        success: function (responseText, statusText, xhr, $form) {
            $("#btnUploadNotPayCustomer").removeClass('disabled');
            if (responseText.success) {
                Common.tip.add({
                    text: "上传成功!",
                    type: 'success'
                });
            } else {
                Common.tip.add({
                    text: responseText.message,
                    type: 'warning'
                });
            }
        }
    };
    $('#frmUploadNotPayCustomer').submit(function () {
        $(this).ajaxSubmit(options);
        return false;
    });
    $("#btnUploadNotPayCustomer").on('click', function () {
        if($("#btnUploadNotPayCustomer").hasClass('disabled')){
            return;
        }
        $("#btnUploadNotPayCustomer").addClass('disabled');
        $('#frmUploadNotPayCustomer').trigger('submit');
    });**/
    
    
	// 上传文件
	$("#btnUploadNotPayCustomer").click(function () {
	    var fileUrl = $("#file_upload").val();
	    if (fileUrl) {
	        $("#frmUploadNotPayCustomer").submit();
        	$("#btnUploadNotPayCustomer").addClass('disabled');
	    } else {
            Common.tip.add({
                text: '上传文件不能为空',
                type: 'warning'
            });
	    }
	});
	
	
	// 下载模板
	$("#btnDownLoadTemplate").click(function () {
	    downLoadTemplate(importType);
	});
    
   
});



/**
 * 设置分页信息
 */
var notPayCustomerPagination = new Pagination({
    template: "#paginationtmpl",
    selector: "#paginationNotPay",
    onchange: function (pageInfo) {
        loadNotPayCustomers(pageInfo.curpage);
    }
});

/**
 * 查询客户信息
 */
function loadNotPayCustomers(notPayCustomerCurPage) {
    if (!notPayCustomerCurPage) {
        notPayCustomerCurPage = 1;
    }

    if (notPayCustomerCurPage < 1)return;
    var createdBy = $("#createdBy").val();
    var beginTime = $("#beginTime").val();
    var endTime = $("#endTime").val();
    var data = {createdBy: createdBy, beginTime: beginTime, endTime: endTime, curPage: notPayCustomerCurPage,importType:importType};
    var url = path.server + '/page/customer/notPayCustomer/list';

    var ajaxHandle = Common.ajax({
        url: url,
        type: "get",
        data: data,
        success: function (data) {
            if (data.success) {
                var html = template('tmplNotPayCustomers', data.details);
                $('#lstNotPayCustomers').html(html);
                var pager = data.details.pagination;
                notPayCustomerPagination.render({
                    curpage: pager.curPage,
                    pagesize: pager.pageSize,
                    totalpage: pager.totalPage,
                    totalsize: pager.totalSize
                })
            } else {
                Common.tip.add({
                    text: data.message,
                    type: 'warning'
                });
            }
        },
        error: function () {
        },
        complete: function () {
        }
    });

    Common.loading({
        text: "",
        container: "#lstNotPayCustomers",
        handle: ajaxHandle
    });
}


var ifFirst = true;
function downloadFileFrameOnload() {
	
    $("#btnUploadNotPayCustomer").removeClass('disabled');
    if (!ifFirst) {
        var ifr = document.getElementById('downloadFileFrameID');
        var callbackResultStr = ifr.contentWindow.document.body.innerText;
        var callbackResult = JSON.parse(callbackResultStr);
        if (callbackResult.success) {
                Common.tip.add({
                    text: callbackResult.message,
                    type: 'success'
                });
        }else{
                Common.tip.add({
                    text: callbackResult.message,
                    type: 'warning'
                });
        }
    } else {
        ifFirst = false;
    }
}

/**
 * 下载导入结果文件
 * @param {} logPid
 */
function downNotPayResultExcelFile(logPid) {
    var url = path.server + '/page/customer/notPayCustomer/download';
    url = url + '?pid=' + logPid;
    document.getElementById('downloadFileFrameID1').src = url;
}

/**
 * 下载导入模板文件
 * @param {} logPid
 */
function downLoadTemplate(importType) {
    var url = path.server + '/page/customer/template/download';
    url = url + '?importType=' + importType;
    document.getElementById('downloadFileFrameID1').src = url;
}


/**
 * 进入待交互客户导入页面
 */
function disPlayNotPayImport() {
    loadNotPayCustomers();
    document.getElementById('buildingList').style.display = 'none';
    document.getElementById('notPayCustomerImportDiv').style.display = 'block';

}


function disPlayNotPayImportBack() {
    loadNotPayCustomers();
    document.getElementById('buildingList').style.display = 'block';
    document.getElementById('notPayCustomerImportDiv').style.display = 'none';
}

/**
 * 显示隐藏导入页面
 * @param {} divId
 */
function disPlayDiv(divId) {
    document.getElementById('notPayCustomerLogListDiv').style.display = 'none';
    if (divId) {
        document.getElementById(divId).style.display = 'block';
        if (divId == 'notPayCustomerLogListDiv') {
            loadNotPayCustomers();
        }
    }
}


 
 
