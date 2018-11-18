var data = {
    'nav': '<div class="btn">H5+</div>',
    'slide': '<div class="btn">H5</div>',
    'pic': '<div class="btn">native</div>'
};
$(function () {
    $("#core_cpt").find(".cpt_node").on("click", function () {
        var item = $(this).attr("name");
        $("#viewCtr .um-content.active").append(data[item]);
    })
    $("#cover_cpt").find(".cpt_item").eq(0).on("click", ".switch_off", function () {
        $("#viewCtr").css("background-image", "url(img/bg.png)");
        //$("#cover_cpt").find(".switch_off").removeClass("act");
        $(this).addClass("act");
    })
    $(document).on("click", "[data-bind]", function () {
        $(".selected").removeClass("selected");
        $(this).addClass("selected");
        var type = $(this).data("bind");
        $("[data-type]").removeClass("active");
        $("[data-type=" + type + "]").addClass("active");
    }).on("click", ".um-footer li", function () {
        var index = $(this).index();
        $(".tabitem,#viewCtr .um-content").removeClass("active").eq(index).addClass("active");

        $("[data-type]").removeClass("active");
        $(".viewitem").removeClass("active").eq(index).addClass("active");
    })

    $(".preview_page").on("click", function () {
        var json = um.get("portalconf");
        json = JSON.stringify(json);
        alert(json);
        $.post("http://uapma.yonyou.com:5050/mobsm/qyy", {qyy: json}, function (data) {
            console.log(data);
        })
    })
})