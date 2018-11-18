$(function () {
    var curOrderList = localStorage.getItem('curOrderList');
    curOrderList = curOrderList ? JSON.parse(curOrderList) : [];
    UM(curOrderList);
    if (curOrderList.length == 0) {
        $('.um-content').html('<div class="tc f16 mt20">当前没有订单，您可以<a href="orderlists.html" class="um-blue">点击这里</a>查看全部订单详情</div>');
    }
    $view('curOrderList').set_datasource(curOrderList);
    $('#curOrderList').delegate('li', 'click', function () {
        var index = $(this).index();
        var rowData = $view('curOrderList').get_value(index) || {};
        localStorage['orderInfo'] = JSON.stringify(rowData);
    });
});
