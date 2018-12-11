const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: './index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [{
            test: /\.css$/,
            loader: 'style-loader!css-loader'
        }]
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true
    },
    plugins: [
        new webpack.SourceMapDevToolPlugin({})
    ]
    // plugins: [
    //     new HtmlWebPackPlugin({
    //         template: "./index.html"
    //     })
    // ]
};