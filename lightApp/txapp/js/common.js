$isWeb = true;

function $pageReady() {
}

// 渲染数据
function render(wrap, data) {
    um.set(wrap, data);
}

function sliceData(source, num, target) {
    var randomIndex = Math.round(Math.random() * (source.length - num));
    var filterData = source.slice(randomIndex, randomIndex + num);
    if (target) render(target, filterData);
    return filterData;
}

$(function () {
    // 数据过滤的选项
    $("#isv").on("click", function () {
        render("isv", isvData);
    })
    $("#appname").on("click", function () {
        render("applyName", appname);
    })

    $("#companys").on("click", function () {
        render("companys", companyName);
    })

    $("#isvname").find(".agree-btn").on("click", function () {
        $("#isv").find(".choice").html($("#isvname").find("input:radio:checked").next().next().html());
    })

    $("#qiye").find(".agree-btn").on("click", function () {
        $("#companys").find(".choice").html($("#qiye").find("input:radio:checked").next().next().html());
    })

    $("#yinyong").find(".agree-btn").on("click", function () {
        $("#appname").find(".choice").html($("#yinyong").find("input:radio:checked").next().next().html());
    })
    // FastClick.attach(document.body);
    $.each($(".um-page"), function () {
        if (!$(this).is($("#enter"))) {
            FastClick.attach(this);
        }
    })
    $(".um-footerbar-item").on("click", function (e) {
        if (this.href) {
            sessionStorage.clear();
        }
    })
    if (!$("#table-nav").length) return;

    $("#table-nav li").click(function () {
        var index = $(this).index();
        var contentH = $(".um-content").height() - 60;
        $(this).addClass("active").siblings().removeClass("active");
        $(".um-table-container").eq(index).height(contentH).find(".um-tb-data").height(contentH - 50).end().siblings(".table-row-scroll").height(0);
    })
    $("#table-nav li").eq(0).trigger("click");


})