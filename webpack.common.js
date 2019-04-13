const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry: {
        app: './src/app.js',
        index : './src/index.js'
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            filename : 'index.htm',
            template: './src/index.htm',
            inject : false,
            hash : true,
        }),
        new HtmlWebpackPlugin({
            filename : 'app.htm',
            template: './src/index.htm',
            inject : false
        })
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