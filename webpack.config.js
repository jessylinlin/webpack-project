//commonjs
const path = require("path")
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

//自定义plugin--清除bundlejs多行注释
class MyPlugin {
    //compiler--构建配置信息 通过compiler注册钩子函数
    apply(compiler) {
        console.log('my plugin')
        //tap注册钩子
        // name 
        //function(compilation) 
        compiler.hooks.emit.tap(
            'MyPlugin',
            //compilation 对象 此次打包的上下文 打包过程产生结果放入此对象
            (compilation) => {
                for (const name in compilation.assets) {
                    // console.log(name)
                    // console.log(compilation.assets[name].source())
                    if (name.endsWith('.js')) {
                        const contents = compilation.assets[name].source()
                        const withoutComments = contents.replace(/(?:^|\n|\r)\s*\/\*[\s\S]*?\*\/\s*(?:\r|\n|$)/g, '')
                        compilation.assets[name] = {
                            source: () => withoutComments,
                            size: () => withoutComments.length
                        }
                    }
                }
            }
        )
    }
}

module.exports = {
    //工作模式：
    mode: 'none',
    //入口文件
    entry: './src/main.js',
    //输出
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist'), //必须为绝对路径
        //打包文件path
        // publicPath: 'dist/'
    },
    //开发服务器
    devServer: {
        contentBase: path.join(__dirname, 'public'),
        proxy: {
            //请求路径前缀
            '/api': {
                //http://localhost:8080/api/users => https:api.github.com/api/users
                target: 'https://api.github.com',
                pathRewrite: {
                    '^/api': ''
                },
                //不能使用 localhost:8080 作为请求 github的主机名
                //实际代理请求 主机名请求； api.github.com
                changeOrigin: true

            }
        }
    },
    resolve: {
        // https://github.com/babel/babel/issues/8462
        // https://blog.csdn.net/qq_39807732/article/details/110089893
        // 如果确认需要node polyfill，设置resolve.fallback安装对应的依赖

        // 如果确认不需要node polyfill，设置resolve.alias设置为false
        alias: {
            crypto: false
        }
    },
    //loader
    module: {
        //其他资源模块加载规则
        rules: [{
            test: /.js$/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ["@babel/preset-env"]
                }
            }
        },
        {
            test: /.css$/,
            use: ['style-loader', 'css-loader']
        },
        {
            test: /.jpg$/,
            // use: 'file-loader'
            use: {
                loader: 'url-loader',
                options: {
                    limit: 10 * 1024 //10kb ,超过10kb会被打包成image单独文件
                }
            }
        },
        // {
        //     test: /.html$/,
        //     use: {
        //         loader: 'html-loader',
        //         options: {
        //             // attr: ['img:src', 'a:href'] old
        //             sources: {
        //                 list: [{
        //                         tag: 'img',
        //                         attribute: 'src',
        //                         type: 'src'
        //                     },
        //                     {
        //                         tag: 'a',
        //                         attribute: 'href',
        //                         type: 'src'
        //                     }
        //                 ]
        //             }
        //         }
        //     }
        // },
        {
            test: /\.hbs$/,
            loader: "handlebars-loader"
        }
        ]
    },
    //plugin
    plugins: [
        //清除输出目录插件
        new CleanWebpackPlugin(), //创建实例
        //html
        new HtmlWebpackPlugin({
            template: './index.html',
            title: 'webpack plugin',
            meta: {
                viewport: "width=device-width"
            }
        }),
        //创建about.html
        new HtmlWebpackPlugin({
            filename: 'about.html',
            template: './index.html'
        }),
        //copy静态文件,开发阶段不使用这个插件， 打包开销大 速度慢
        //新增patterns:[]
        // new CopyWebpackPlugin({
        //     patterns: [{
        //         from: path.join(__dirname, 'public'),
        //         to: 'public'
        //     }],
        // }),
        //自定义plugin
        // new MyPlugin()
    ]
}