var data = {
    portrait: "",
    fullName: "",
    roomNum: "",
    cardNum: ""
}
var vm = avalon.define({
    $id: "card",
    data: data,
    print: function () {
        var second = $(".card").clone();
        $("body").append(second);
        window.print();
        second.remove();
    },
    back: function () {
        //localStorage.serialNumber = vm.data.serialNumber || "";
        //location.href = "record.html";
    },
    save: function () {
        $("#card_form").submit();
        $("#upload_frame").load(function () { //获取iframe中的内容
            var body = $(window.frames['upload_frame'].document.body);
            var data = eval('(' + body[0].textContent + ')');
            console.log(data)
        });
    }
})
$(function () {

})
