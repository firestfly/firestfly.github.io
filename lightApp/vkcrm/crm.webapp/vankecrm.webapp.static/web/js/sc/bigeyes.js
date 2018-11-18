//文档扫描
function openDevice(obj) {
    obj.OpenDevice();
    obj.SetJPGQuality(60);
}

function closeDevice(obj) {
    obj.CloseDevice();
    $("#resolutionLb").val(3);
    $("#sizeLb").val(2);
    $("#colorLb").val(1);
    $("#docTitle").val("");//文档标题
    $("#docTypeLb").val("DCTP");
    $("#docPageNo").val(1);//当前页码
    $("#sanedimg").html("");
    window.Page_userinfo["yingxiang"].init();
}

function changeResolution(obj, sel) {
    obj.ChangeResolution(sel.selectedIndex);
}

function changeScanSize(obj, sel) {
    obj.ChangeScanSize(sel.selectedIndex);
}

function changeScanColor(obj, sel) {
    obj.ChangeScanColor(sel.selectedIndex);
}

function changeRotate(obj, sel) {

    obj.ChangeRotate(sel.selectedIndex);
}

function changeThreshold(obj, value) {
    obj.SetTresVal(value);
}

function changeJPGQuality(obj, value) {
    obj.SetJPGQuality(value);
}

function scanvalidate(docTitle, docPageNo) {
    if (docTitle.val() == "" || docTitle.val().length == 0) {
        alert("文档标题不能为空！");
        docTitle.focus();
        return false;
    }

    if (docPageNo.val() == "" || docPageNo.val().length == 0) {
        alert("当前页码不能为空！");
        docPageNo.focus();
        return false;
    }
    return true;
}

function scanMaster(obj, docTypeLb, docTitle, docPageNo, archLocation, archDate, storageYears, secretLevelLb, barCode, barcodeType, scanResult) {
    if ("1" != docPageNo.value) {
        alert("请使用【扫描其他页】按钮!");
        return;
    }
    scanResult.value = "";
    if (scanvalidate(docTitle, docPageNo)) {
        if (barcodeType.value == '2' && barCode.value.length == 0) {
            alert("请手动输入条码值！");
            barCode.focus();
            return;
        }

        if (barcodeType.value == '3' && barCode.value.length == 0) {
            alert("请生成条码值！");
            return;
        }
        var docType;
        if (docTypeLb && docTypeLb.selectedIndex > 0)
            docType = docTypeLb.options[docTypeLb.selectedIndex].value;
        var code = obj.ScanMaster(docType, docTitle.value, docPageNo.value, archLocation.value, archDate.value, storageYears.value, secretLevelLb.options[secretLevelLb.selectedIndex].value, barCode.value.toUpperCase(), barcodeType.value);
        if (code.length > 0) {
            barCode.value = code;

            var pageNo = parseInt(docPageNo.value);
            pageNo = pageNo + 1;
            docPageNo.value = pageNo;

            scanResult.value = "条码页，扫描成功！";
        }
    }
}

function scanSlave(obj, docTypeLb, docTitle, docPageNo, archLocation, archDate, storageYears, secretLevelLb, barCode, scanResult) {
    scanResult.value = "";

    if (scanvalidate(docTitle, docPageNo)) {
        var docType;
        if (docTypeLb && docTypeLb.selectedIndex > 0)
            docType = docTypeLb.options[docTypeLb.selectedIndex].value;
        scanResult.value = "扫描中......"
        var result = obj.ScanSlave(docType, docTitle.value, docPageNo.value, archLocation.value, archDate.value, storageYears.value, secretLevelLb.options[secretLevelLb.selectedIndex].value, barCode.value.toUpperCase());
        if (result.length > 0) {
            var pageNo = parseInt(docPageNo.value);
            pageNo = pageNo + 1;
            docPageNo.value = pageNo;
            scanResult.value = result;
        }
        else {
            scanResult.value = "扫描失败,请重新扫描！";
        }
    }
}

function tick(){
    var years, months, days, hours, minutes, seconds;
    var intYears, intMonths, intDays, intHours, intMinutes, intSeconds;
    var today;
    today = new Date(); // 系统当前时间
    intYears = today.getFullYear(); // 得到年份,getFullYear()比getYear()更普适
    intMonths = today.getMonth() + 1; // 得到月份，要加1
    intDays = today.getDate(); // 得到日期
    intHours = today.getHours(); // 得到小时
    intMinutes = today.getMinutes(); // 得到分钟
    intSeconds = today.getSeconds(); // 得到秒钟
    years = intYears + "-";
    if (intMonths < 10) {
        months = "0" + intMonths + "-";
    } else {
        months = intMonths + "-";
    }
    if (intDays < 10) {
        days = "0" + intDays + " ";
    } else {
        days = intDays + " ";
    }
    if (intHours == 0) {
        hours = "00:";
    } else if (intHours < 10) {
        hours = "0" + intHours + ":";
    } else {
        hours = intHours + ":";
    }
    if (intMinutes < 10) {
        minutes = "0" + intMinutes + ":";
    } else {
        minutes = intMinutes + ":";
    }
    if (intSeconds < 10) {
        seconds = "0" + intSeconds + " ";
    } else {
        seconds = intSeconds + " ";
    }
    archdate=years + months + days;//归档日期
}

var archdate;//归档日期
function scancustomerinfo() {
    var docscan = document.getElementById("docScan");
    var doctype = $("#docTypeLb").val();//文档类型
    var doctypetext = $("#docTypeLb option:selected").html();
    var docsubtype = $("#docSubTypeLb").val();//文档子类型
    var doctitle = $("#docTitle");//文档标题
    var docpageno = $("#docPageNo");//当前页码
    var archlocation = $("#archLocation").val();//原件归档位置
    //var archdate = $("#archDateDtb").val();//归档日期
    var storageyears = $("#storageYears").val();//保存年限
    var secretlevel = $("#secretLevelLb").val();//保密级别
    var barcode = $("#barCode").val();//条码值
    var scanresult = $("#scanResult");//扫描结果
    var companyCode = $("#companyCode").val();
    var projectCode = $("#projectCode").val();
    tick();//归档日期 2015-10-19

    ScanImg(docscan, companyCode, projectCode, doctype,doctypetext, docsubtype, doctitle, docpageno, archlocation, archdate, storageyears, secretlevel, barcode, scanresult);
}

function ScanImg(obj, unit, project, docTypeLb,doctypetext, docSubTypeLb, docTitle, docPageNo, archLocation, archDate, storageYears, secretLevelLb, barCode, scanResult) {

    scanResult.val("");
    if (scanvalidate(docTitle, docPageNo)) {
        scanResult.val("扫描中......");
        //扫描影像上传至大眼睛系统
        var result = obj.ScanImg(unit, project, docTypeLb, docSubTypeLb, docTitle.val(), docPageNo.val(), archLocation, archDate, storageYears, secretLevelLb, barCode.toUpperCase());
        if (result!=null && result.length > 0) {
            var pageNo = parseInt(docPageNo.val());
            $("#sanedimg").append("<li><span>页码：</span><span>" + pageNo + "</span>&nbsp;&nbsp;&nbsp;<span>标题：</span><span>" + docTitle.val() + "</span>&nbsp;&nbsp;&nbsp;<span>类型：</span><span>" + doctypetext + "</span></li>");
            pageNo = pageNo + 1;
            docPageNo.val(pageNo);
            scanResult.val(result);
            var customerCode = window.customerCode;
            if (customerCode != "" && customerCode  != null) {
                var data = {
                    barCode: barCode.toUpperCase(),
                    custCode: customerCode
                }
                Common.ajax({
                    url: window.path["server"]+'/page/bigeyes/writebackcustcode',
                    type: "post",
                    data: data,
                    success: function (res) {
                        if (res.success) {
                            alert('保存影像成功!');
                        }else{
                            alert('回写影像用户编码失败!');
                        }
                    },
                    error: function () {

                    },
                    complete: function () {

                    }
                })

            } else {
                alert("客户编码不能为空");
            }
        }
        else {
            scanResult.val("扫描失败,请重新扫描！");
        }
    }
}