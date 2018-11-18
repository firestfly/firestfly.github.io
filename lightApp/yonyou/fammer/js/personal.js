$(function () {
    var customer = localStorage['customer'];
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

    UM(customer.personInfo);

    $('#submit').click(function () {
        customer.personInfo = $model().toJSON();
        localStorage['customer'] = JSON.stringify(customer);
    });

})
