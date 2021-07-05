//commonjs
const path = require("path")

module.exports = {
    //工作模式：
    mode: 'none',
    //入口文件
    entry: './src/main.js',
    //输出
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist') //必须为绝对路径
    },


}