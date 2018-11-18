/**
 * Created by Administrator on 2014/5/23.
 */
var express = require("express"), port = 8080;
var app = express(),
    users = [
        {name: 'Clonn'},
        {name: 'Chi'}
    ];
app.listen(port);
app.all('/user/:id/:op?', function (req, res, next) {
    req.user = users[req.params.id];
    if (req.user) {
        next();
        console.log(next);
    } else {
        next(new Error('cannot find user ' + req.params.id));
    }
});
app.get('/user/:id', function (req, res) {
    res.send('viewing ' + req.user.name);
});
app.get('/user/:id/edit', function (req, res) {
    res.send('editing ' + req.user.name);
});
app.get('/user/:id/delete', function (req, res) {
    res.send('deleting ' + req.user.name);
});
app.get('*', function (req, res) {
    res.send('Page not found!', 404);
});
console.log('start express server\n');