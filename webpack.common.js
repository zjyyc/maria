const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry: {
        login: './src/login.js',
        index : './src/index.js',
        config : './src/config.js',
        'edit-data' : './src/edit-data.js',
        'edit-data-user' : './src/edit-data-user.js',
        user : './src/user.js'
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title : '登陆',
            filename : 'login.htm',
            template: './src/template.htm',
            inject : false,
            hash : true,
            jsList : []
        }),
        new HtmlWebpackPlugin({
            title : '首页',
            filename : 'index.htm',
            template: './src/template.htm',
            inject : false,
            hash : true,
            jsList : []
        }),
        new HtmlWebpackPlugin({
            title : '配置中心',
            filename : 'config.htm',
            template: './src/template.htm',
            inject : false,
            hash : true,
            jsList : []
        }),
        new HtmlWebpackPlugin({
            title : '编辑数据',
            filename : 'edit-data.htm',
            template: './src/template.htm',
            inject : false,
            hash : true,
            jsList : []
        }),
        new HtmlWebpackPlugin({
            title : '编辑数据',
            filename : 'edit-data-user.htm',
            template: './src/template.htm',
            inject : false,
            hash : true,
            jsList : []
        }),
        new HtmlWebpackPlugin({
            title : '编辑数据',
            filename : 'user.htm',
            template: './src/template.htm',
            inject : false,
            hash : true,
            jsList : []
        }),
    ],
    output: {
        filename: '[name]-[hash].js',
        path: path.resolve(__dirname, 'build')
    },
    module: {
        rules : [{
            test: /\.less$/,
            use : ['style-loader' , 'css-loader' , 'less-loader']
        },
        {
            test: /\.(js|jsx)$/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['es2015', 'react'],
                }
            },
            exclude: /node_modules/
        }]
    }
};  