$(function () {
    var about = localStorage.getItem('about');
    about = (about != undefined) ? JSON.parse(about) : {
        title: '送菜上门',
        intro: '微信卖菜；定位为“可信赖的社区生鲜平台”，依托“移动互联网”的发展，连接农民与百姓家庭，农民自产直供食材，为每个家庭提供未上架的果蔬食材，开创中国生鲜经营新业态；青年农民，59分钟送菜上门，12小时无条件退换货。 接单时间：全天24小时 送货时间：早8:30--晚20:30 晚20:30至早8:30的订单，第二日送货 您也可以在备注里注明送货时间',
        comments: [
            {
                text: '韭菜略老一些了。半小时就送到了。建议扩大业务范围，将超市中货品加入购物车。借用现成平台是个好方向',
                response: '[店铺回复] 亲，我们上午的订单是10：00开始配送的，10点之前的订单都是从10点开始计时。',
                time: '2012/4/5 11:00:03',
                upCount: 1,
                downCount: 1
            },
            {text: '挺好，菜挺新鲜的，下雨送的晚了点', response: '', time: '2012/4/5 10:50:20', upCount: 1, downCount: 2},
            {text: '蔬菜不错，下雨天快递大哥也能及时送到，赞', response: '', time: '2012/4/5 10:30:05', upCount: 12, downCount: 0}
        ]
    };
    UM(about);

    $(".up").on("click", function () {
        var commentsListView = $view('comments');
        var rowIndex = commentsListView.getRowIndex(this);
        var count = commentsListView.get_value(rowIndex, 'upCount');
        commentsListView.set_value(rowIndex, 'upCount', count + 1);

        var listData = $view('comments').get_datasource();
        console.log(listData);
        about.comments = listData;
        localStorage.setItem('about', JSON.stringify(about));
    })

    $(".down").on("click", function () {
        var $count = $(this).find(".down-count");
        var rowIndex = $count.closest('li').index();
        var count = parseInt($count.html());
        $view('comments').set_value(rowIndex, 'downCount', count + 1);
        var listData = $view('comments').get_value();
        about.comments = listData;
        localStorage.setItem('about', JSON.stringify(about));

    })
});
