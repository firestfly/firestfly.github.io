var id = setTimeout(init_listener, 300);
var tempData = allCompany.data["items"].slice(20);

function init_listener() {
    var pnode = $("#allCompany"), count = 0;
    // 每个li元素下的radio监听
    pnode.on("change", "input[type=checkbox]", function (e) {
        if (this.checked) {
            count++;
        } else {
            count--;
        }
        $(".collect .um-orange").html(count);
    })
    // 全选
    $("#checkAll").on("change", function () {
        if (this.checked) {
            count = pnode.find("li").length;
            pnode.find("input[type=checkbox]").prop("checked", true);
        } else {
            count = 0;
            pnode.find("input[type=checkbox]").prop("checked", false);
        }
        $(".collect .um-orange").html(count);
    })
    // ISV每一行详情
    pnode.on("click", "a", function (e) {
        var index = $(this).closest("li").index();
        render("isvDetail", tempData[index]);
    })
}

$(function () {
    $("#status").find(".agree-btn").on("click", function () {
        $("#astatus").find(".choice").html($("#status").find("input:radio:checked").next().next().html());
    })
    // 调用同意审批和拒绝审批
    var msg = ["审核成功", "审核失败"];

    var returnMsg = function () {
        alert(msg[Math.floor(Math.random() * 2)]);
    }

    $("#enter").on("click", ".agree-btn,.refuse-btn", function () {
        returnMsg();
    })

    $("#filter").on("click", ".um-back, .agree-btn", function () {
        tempData = sliceData(tempData, 5, "allCompany");
    })

    $("#isvDetail").find(".refuse-btn").on("click", function () {
        returnMsg();
    }).end().find(".agree-btn").on("click", function () {
        returnMsg();
    })
    render("allCompany", tempData);
})
