$(function () {
    var curOrder = JSON.parse(localStorage.getItem('curOrder'));
    var goods = JSON.parse(localStorage.getItem('goods'));
    var loginObj = JSON.parse(localStorage.getItem('loginObj'));
    var sum = 0;
    var len = 0;
    var i = 0;
    var good;
    var price;
    var incre = 0, decre = 0, num = 0;
    curOrder = curOrder || {
        orders: [],
        cost: '￥0',
        ordertime: '',
        orderStatus: '未处理',
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

    goods = goods || null;
    if (goods) {
        curOrder.orders = [];
        len = goods.length;
        for (i = 0; i < len; i++) {
            good = goods[i];
            price = good['priceEnd'];
            num = good['buyNum'];
            if (num > 0) {
                incre = price.mul(num);
                sum = sum.add(incre);
                curOrder.orders.push(good);
            }
        }
        curOrder.cost = '￥' + sum;
    }
    UM(curOrder);

    if (curOrder.orders.length == 0) {
        $('.um-content').html('<div class="tc f16 mt20">购物车里没有任何物品，请先去<a href="index.html" class="um-blue">这里选货</a>吧</div>');
    }
    $view('orders').set_datasource(curOrder.orders);

    $(".add").on("click", function () {
        var $count = $(this).prev(".count");
        var count = parseInt($count.html() || 0);
        var rowIndex = $(this).closest('li').index();
        var price = $view('orders').get_value(rowIndex, 'priceEnd');
        count++;
        $view('orders').set_value(rowIndex, 'buyNum', count);
        sum = sum.add(price);
        $model().set('cost', '￥' + sum);
    })

    $(".reduce").on("click", function () {
        var $count = $(this).next(".count");
        var count = parseInt($count.html() || 0);
        var rowIndex = $(this).closest('li').index();
        var price = $view('orders').get_value(rowIndex, 'priceEnd');
        count--;
        $view('orders').set_value(rowIndex, 'buyNum', count);
        sum = sum.add(-price);
        $model().set('cost', '￥' + sum);
    });

    $('#submit').on('click', function () {
        var cost = +($model().get('cost').substr(1));
        if (cost < 1) {
            $alert('购物车不能为空,无法提交!');
            return false;
        } else {
            $model().set('orderStatus', '未付款');
            if (loginObj) {
                return true;
            } else {
                window.open('login.html', '_self');
                return false;
            }
        }
    });

    $(window).on("pagehide", function (e) {
        var curOrder = $model().toJSON();
        curOrder.orders = $view('orders').get_value();
        localStorage.setItem("goods", JSON.stringify(goods));
        localStorage.setItem("curOrder", JSON.stringify(curOrder));
    });
})
