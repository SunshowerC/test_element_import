var path = require('path');
var webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const ExtractTextPlugin = require("extract-text-webpack-plugin");

var resolve = path.resolve;

module.exports = {
    entry: {
        main: './src/main.js',

    },
    output: {
        path:  resolve(__dirname, './build'),
        publicPath: '/build/' ,
        filename:'[name].[hash:8].js'
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        loader: 'css-loader',
                        options: {
                            minimize: process.env.NODE_ENV === 'production',
                        }
                    },
                    postcss: [
                        require('autoprefixer')({
                            browsers: ['last 5 versions']
                        })
                    ]

                }
            },
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.js$/,
                loader: 'babel-loader?cacheDirectory',
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]?[hash]'
                }
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
                loader: 'file-loader'
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            },
            {
                test: /\.scss$/,
                loader: 'style-loader!css-loader!autoprefixer-loader?{browsers:["last 5 version", "Firefox' +
                ' 15"]}!sass-loader?sourceMap&outputStyle=compressed'
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.vue'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            'components':  resolve(__dirname, './src/components'),
            'page':  resolve(__dirname, './src/page'),
            'style':  resolve(__dirname, './src/style'),
            'script':  resolve(__dirname, './src/script'),
            'static':  resolve(__dirname, './static')
        }
    },
    devServer: {
        historyApiFallback: true,
        noInfo: true
    },
    performance: {
        hints: false
    },
    devtool: '#eval-source-map'
}

if (process.env.NODE_ENV === 'production') {
    module.exports.devtool = '#source-map'
    // http://vue-loader.vuejs.org/en/workflow/production.html
    module.exports.plugins = (module.exports.plugins || []).concat([
        // new ExtractTextPlugin("style.[hash:8].css"),

        new CleanWebpackPlugin(['build/*'], {
            root: resolve(__dirname,'../resources/static'),
            verbose: true,
            dry: false,
            exclude: [],
            watch: false
        }),
        new HtmlWebpackPlugin({
            template: './index-template.html',
            filename:  '../index.html'
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            // sourceMap: true,

            // 最紧凑的输出
            beautify: false,
            // 删除所有的注释
            comments: false,

            compress: {
                warnings: false,
                // 删除所有的 `console` 语句
                // 还可以兼容ie浏览器
                drop_console: true,
                // 内嵌定义了但是只用到一次的变量
                collapse_vars: true,
                // 提取出出现多次但是没有定义成变量去引用的静态值
                reduce_vars: true,
            }
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        })

    ])
}
