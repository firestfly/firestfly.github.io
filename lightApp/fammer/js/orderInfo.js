$(function () {
    var orderInfo = localStorage.getItem('orderInfo');
    var prevurl = localStorage.getItem('curPage') || 'orderlists.html';
    orderInfo = orderInfo ? JSON.parse(orderInfo) : {};
    UM(orderInfo);
    $('.um-header a').attr('href', prevurl);
});

