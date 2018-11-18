var path = require('path');
var webpack = require('webpack');
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');
//var TransferWebpackPlugin = require('transfer-webpack-plugin');
// multiple extract instances
var extractCSS = new ExtractTextPlugin('[name].css');
var extractSASS = new ExtractTextPlugin('[name].scss');
var TEM_PATH = path.resolve(__dirname, 'template');
module.exports = {
    entry: {
        "2": ["./js/2", "./css/base.css", "./css/common.css", "./css/vk.modal.css"],
        "4": ["./js/4", "./css/base.css", "./css/common.css", "./css/vk.modal.css"],
        "5": ["./js/5", "./css/base.css", "./css/common.css", "./css/vk.modal.css"],
        "4_1": ["./js/4_1", "./css/base.css", "./css/common.css", "./css/vk.modal.css"],
        "vendors": ['jquery', 'avalon']
    },
    output: {
        path: __dirname + '/assets/',
        publicPath: "./assets/",
        filename: '[name].js'
    },
    module: {
        loaders: [{
            test: /\.(css)$/,
            loader: extractCSS.extract(['css', 'autoprefixer'])
        }, {
            test: /\.(png|jpg)$/,
            loader: 'file-loader?name=img/[name].[ext]'
        }, {
            test: /\.(scss)$/,
            loader: extractCSS.extract(['css', 'autoprefixer', 'sass'])
        }, {
            test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
            loader: "url?limit=10000&mimetype=application/font-woff"
        }, {
            test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
            loader: "url?limit=10000&mimetype=application/octet-stream"
        }, {
            test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
            loader: "file"
        }, {
            test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
            loader: "url?limit=10000&mimetype=image/svg+xml"
        }]
    },
    resolve: {
        root: "./",
        extensions: ["", ".js", ".scss", ".json"],
        alias: {
            "jquery": './js/jquery.min.js',
            "avalon": "./js/avalon/avalon.js"
        }
    },
    extensions: ['', '.js', '.json', '.scss'],
    //插件项  
    plugins: [
        extractCSS,
        extractSASS,
        new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js')
    ]
};
