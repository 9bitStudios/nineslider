var webpack = require('webpack');

module.exports = {
    entry: __dirname + '/Main.js',
    output: {
        path: __dirname,
        filename: "app.js"
    },
    watch: true,
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query:{
                    presets: ['es2015', 'react']
                }
            }
        ]
    },
    devServer: {
        stats: {
            colors: true
        },
        inline: true
    },   
    plugins:[]
};