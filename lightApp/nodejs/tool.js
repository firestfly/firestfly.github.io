module.exports = {
    cookieParser: function (request, response) {
        if (request.headers['Cookie']) {
            //do parsing
        }
    }
};