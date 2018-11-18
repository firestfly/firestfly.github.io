$(function () {
    var curOrder = localStorage.getItem('curOrder');
    var i1, i2, i3;
    var value1, value2, value3;
    var len1, len2, len3;
    var sum = 0;
    var incre = 0, decre = 0, num = 0;
    curOrder = curOrder ? JSON.parse(curOrder) : {
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
    var goods = localStorage.getItem('goods');
    goods = goods ? JSON.parse(goods) : null;
    if (goods) {
        curOrder.orders = [];
        len1 = goods.length;
        for (i1 = 0; i1 < len1; i1++) {
            value1 = goods[i1]['subclass'];
            len2 = value1.length;
            for (i2 = 0; i2 < len2; i2++) {
                value2 = value1[i2]['list'];
                len3 = value2.length;
                for (i3 = 0; i3 < len3; i3++) {
                    value3 = value2[i3];
                    num = +(value3['num']);
                    if (num > 0) {
                        incre = (+(value3['price'].substr(1))).mul(num);
                        sum = sum.add(incre);
                        curOrder.orders.push(value3);
                    }
                }
            }
        }
        curOrder.cost = '￥' + sum;
    }

    UM(curOrder);
    if (curOrder.orders.length == 0) {
        $('.um-content').html('<div class="tc f16 mt20">购物车里没有任何物品，请先去<a href="index.html" class="um-blue">这里选货</a>吧</div>');
    }
    $view('orders').set_datasource(curOrder.orders);

    var init = function () {
        var list = $(".right-list-item").eq(0);
        var $count = list.find(".count"),
            count = 0,
            value;
        $.each($count, function () {
            value = $(this).html();
            if (value != "" && (value = parseInt(value)) > 0) {
                count += value;
                $(this).siblings(".reduce").addBack().addClass("show");
            }
        });
    }
    init();

    $(".add").on("click", function () {
        var $count = $(this).prev(".count");
        var count = parseInt($count.html() || 0);
        var rowIndex = $(this).closest('li').index();
        var price = +($view('orders').get_value(rowIndex, 'price').substr(1));
        count++;
        $view('orders').set_value(rowIndex, 'num', count);
        sum = sum.add(price);
        $model().set('cost', '￥' + sum);
        $count.addClass("show");
        $(this).siblings(".reduce").addClass("show");

    })

    $(".reduce").on("click", function () {
        var $count = $(this).next(".count");
        var count = parseInt($count.html() || 0);
        var rowIndex = $(this).closest('li').index();
        var price = +($view('orders').get_value(rowIndex, 'price').substr(1));
        if (count < 2) {
            $(this).add($count).removeClass("show");
        }
        count--;
        $view('orders').set_value(rowIndex, 'num', count);
        sum = sum.add(-price);
        if (sum < 1) sum = 0;
        $model().set('cost', '￥' + sum);
    });

    $('#submit').on('click', function () {
        var cost = +($model().get('cost').substr(1));
        if (cost < 1) {
            $alert('购物车不能为空,无法提交!');
            return false;
        } else {
            $model().set('orderStatus', '未付款');
            return true;
        }
    });

    $(window).on("pagehide", function (e) {
        var curOrder = $model().toJSON();
        curOrder.orders = $view('orders').get_value();
        localStorage['goods'] = JSON.stringify(goods);
        localStorage['curOrder'] = JSON.stringify(curOrder);
    });
})
