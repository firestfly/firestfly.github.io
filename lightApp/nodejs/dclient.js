var dnode = require('dnode');
dnode.connect(8000, 'localhost', function (remote) {
    remote.restart(function (str) {
        console.log(str);
        process.exit();
    });
});