/**
 * Created by Administrator on 2014/5/22.
 */
/*var app = require('express').createServer(),
 */
var express = require("express"), port = 8080;
var app = express();
app.listen(port);
app.get('/', function (req, res) {
    res.send('hello world');
});
app.get('/test', function (req, res) {
    res.send('test render');
});
app.get('/user/', function (req, res) {
    res.send('user page');
});
app.get('/user/:id', function (req, res) {
    res.send('user: ' + req.params.id);
});
app.get('/:number', function (req, res) {
    res.send('number: ' + req.params.number);
    console.log(req.params);
});
app.get(/^\/ip?(?:\/(\d{2,3})(?:\.(\d{2,3}))(?:\.(\d{2,3}))(?:\.(\d{2,3})))?/, function (req, res) {
    res.send(req.params);
    //http://localhost:8080/ip/255.255.100.10
});
app.get('*', function (req, res) {
    res.send('Page not found!', 404);
});
var request = require('superagent');

request.post('https://api.weibo.com/oauth2/access_token?client_id=3895251115&client_secret=0f1f127aea96b9c85adf603de45663c9&grant_type=authorization_code&redirect_uri=http://t-weixin.gionee.com/sina/&code=facb8cabfb2972dc0721f4336f7300cf', {}, function (error, res) {
    console.log(res);
});
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.session());
console.log('start express server\n');