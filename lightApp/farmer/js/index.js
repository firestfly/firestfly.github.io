$(function () {
    var $left_li = $(".left-list").find("li");
    var content_h = $(window).height() - 120;
    $(".left-list,.right-list").height(content_h);
    $(".cancle").on("touchstart mousedown", function () {
        $(this).prev("input").blur();
    })
    $left_li.on("touchstart mousedown", function () {
        var $this = $(this);
        $this.addClass("active").siblings().removeClass("active");

        var index = $(this).index();
        $(".right-list-item").eq(index).addClass("active").siblings(".right-list-item").removeClass("active");
    })
});