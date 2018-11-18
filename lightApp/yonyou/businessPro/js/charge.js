$(function () {
    var curOrder = JSON.parse(localStorage.getItem('curOrder'));
    var allOrders = JSON.parse(localStorage.getItem('allOrders'));
    var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

    function generateMixed(n) {
        var res = "";
        for (var i = 0; i < n; i++) {
            var id = Math.ceil(Math.random() * 35);
            res += chars[id];
        }
        return res;
    }

    curOrder = curOrder || {
        orders: [],
        cost: '￥0',
        orderStatus: '未处理',
        ordertime: '',
        paymethod: '货到付款',
        discount: true,
        personInfo: {
            id: 3007,
            name: '我来自火星',
            nickname: '独自等待',
            tel: '130********',
            sex: 'Male',
            country: '中国',
            address: '北京市海淀区上地三街',
            remark: ''
        }

    };
    curOrder.ordernumber = curOrder.ordernumber || generateMixed(14);
    allOrders = allOrders || [];
    UM(curOrder);
    if (curOrder.orders.length == 0) {
        $('.um-content').html('<div class="tc f16 mt20">当前没有新订单，请先去<a href="index.html" class="um-blue">这里选货</a>吧</div>');
    }

    $('#submit').on('click', function () {
        var cost = +($model().get('cost').substr(1));
        if (cost < 1) {
            $alert('购物车不能为空,无法提交!');
            return false;
        } else {
            $model().set('orderStatus', '已支付');
            return true;
        }
    });

    $(window).on("pagehide", function (event) {
        var time = new Date().format("yyyy-MM-dd hh:mm");
        $model().set('ordertime', time);
        var curOrder = $model().toJSON();
        allOrders.push(curOrder);
        localStorage['allOrders'] = JSON.stringify(allOrders);
        localStorage.removeItem('curOrder');
        localStorage.removeItem('goods');
    });
});