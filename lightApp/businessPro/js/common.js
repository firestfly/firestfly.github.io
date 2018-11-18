$(function () {
    var init = function () {
        var $ul = $(".top-list").find("ul"),
            $li = $ul.find("li"),
            w = 10, $li_width = 0;
        $.each($li, function () {
            $li_width = $(this).outerWidth();
            w += $li_width;
        })
        $ul.width(w);
        console.log(w)
    }
    init();
});
