(function() {

    //停车位初始化
    window.carport["info"].init(window.carportId);
    //停车位车主
    window.carport["relation"].init(window.carportId);
    //物业服务
    window.carport["subscribe"].init(window.carportId);
    //历史客户
    var ownerHistory_showbtn = $("#ownerHistory_showbtn");
    var ownerHistory_bar = $("#ownerHistory_bar");
    var carportStatus = $("#btn_carportStatus");

    ownerHistory_showbtn.on("click", function() {
        if (ownerHistory_bar.hasClass("active")) {
            ownerHistory_bar.removeClass("active");
        } else {
            window.carport["history"].init(window.carportId);

        }
        return false;
    });

    carportStatus.bind("click", function () {
        //车位状态
        window.carport["status"].init({
            data: carport["info"]["houseInfo"]
        });
    });

})();