const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require('path');

module.exports = {
    entry: './index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [{
            test: /\.css$/,
            loader: ["css-loader"]
        }]
    }
    // plugins: [
    //     new HtmlWebPackPlugin({
    //         template: "./index.html"
    //     })
    // ]
};