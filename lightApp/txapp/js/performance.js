// 省市查询
function byProvince(data) {
    $("#byProvince").find("tr").remove();
    var str = "";
    for (var i = 0, len = data.length; i < len; i++) {
        str += '<tr><td>' + data[i].regionname + '</td><td>' + data[i].registernum + '</td><td>' + data[i].activenum + '</td><td>' + data[i].callingduration + '</td></tr>';
    }
    $("#byProvince").append(str);
}

// 导航
function byCom(data) {
    $("#byCom").find("tr").remove();
    var str = "";
    console.log(data)
    for (var i = 0, len = data.length; i < len; i++) {
        str += '<tr><td>' + data[i].isvname + '</td><td>' + data[i].registernum + '</td><td>' + data[i].activenum + '</td><td>' + data[i].callingduration + '</td></tr>';
    }
    $("#byCom").append(str);
}

// ISV
function byIsvName(data) {
    $("#byIsvName").find("tr").remove();
    var str = "";
    for (var i = 0, len = data.length; i < len; i++) {
        str += '<tr><td>' + data[i].isvname + '</td><td>' + data[i].carriernum + '</td><td>' + data[i].registernum + '</td><td>' + data[i].activenum + '</td><td>' + data[i].callingduration + '</td></tr>';
    }
    $("#byIsvName").append(str);
}

// 应用名
function byAppName(data) {
    $("#byAppName").find("tr").remove();
    var str = "";
    for (var i = 0, len = data.length; i < len; i++) {
        str += '<tr><td>' + data[i].applicationname + '</td><td>' + data[i].carriernum + '</td><td>' + data[i].registernum + '</td><td>' + data[i].activenum + '</td><td>' + data[i].callingduration + '</td></tr>';
    }
    $("#byAppName").append(str);
}

function init() {
    byProvince(byProvinceData.data["items"]);
    byAppName(byAppNameData.data["items"]);
    byIsvName(byIsvNameData.data["items"]);
    byCom(byComData.data["items"]);
}

$(function () {
    $("#filter").on("click", ".um-back, .agree-btn", function () {
        byProvince(sliceData(byProvinceData.data["items"], 10));
        byAppName(sliceData(byAppNameData.data["items"], 10));
        byIsvName(sliceData(byIsvNameData.data["items"], 10));
        byCom(sliceData(byComData.data["items"], 10));
    })
    init();
})