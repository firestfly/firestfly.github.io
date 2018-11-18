$(function () {
    $('#user-login').submit(function () {
        var loginObj = $(this).serializeArray();
        localStorage.setItem('loginObj', JSON.stringify(loginObj));
    });
});