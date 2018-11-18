$(function () {
    var allOrders = localStorage['allOrders'];
    var customer = localStorage['customer'];
    var order;
    allOrders = allOrders ? JSON.parse(allOrders) : [];
    customer = customer ? JSON.parse(customer) : {
        personInfo: {
            id: 3007,
            name: '我来自火星',
            nickname: '独自等待',
            tel: '130********',
            sex: 'Male',
            country: '中国',
            address: '北京市海淀区上地三街'
        },
        orders: {
            'allOrders': {
                num: 0,
                list: []
            },
            'newOrders': {
                num: 0,
                list: []
            },
            'deliverOrders': {
                num: 0,
                list: []
            },
            'ensureOrders': {
                num: 0,
                list: []
            },
            'commentOrders': {
                num: 0,
                list: []
            }


        },

        benefits: {
            points: 10
        }
    };

    for (var i = 0; i < allOrders.length; i++) {
        order = allOrders[i];
        customer.orders.allOrders.list.push(order);
        customer.orders.allOrders.num++;
        if (allOrders[i].orderStatus == '未付款') {
            customer.orders.newOrders.list.push(order);
            customer.orders.newOrders.num++;
        } else if (allOrders[i].orderStatus == '已支付') {
            customer.orders.deliverOrders.list.push(order);
            customer.orders.deliverOrders.num++;
        }
    }
    UM(customer);

    $('#farmerAllList li').on('click', function () {
        localStorage['curOrderList'] = JSON.stringify(customer.orders.allOrders.list);
        localStorage['curPage'] = 'allOrders.html';
    });

    $('#farmerlist').delegate('li', 'click', function () {
        var index = $(this).index();
        switch (index) {
            case 0:
                localStorage['curOrderList'] = JSON.stringify(customer.orders.newOrders.list);
                localStorage['curPage'] = 'newOrders.html';
                break;
            case 1:
                localStorage['curOrderList'] = JSON.stringify(customer.orders.deliverOrders.list);
                localStorage['curPage'] = 'deliverOrders.html';
                break;
            default :
        }
    })
})