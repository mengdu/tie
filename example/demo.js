const fs = require('fs')
const path = require('path')
const lib = require('../index')

/**
 * @tie
 * @title 主页
 * @des 接口说明
 * @route GET /
 * @type json
 * @header {string} [token] Token
 * @header {string} Content-Type 类型
 * @query {number} [page=1] 页码
 * @query {number} [pageSize=10] 页码
 * @body {number} id 用户id
 * @response {object} data 用户数据
 * @example example/index
 * **/
function Index () {}

/**
 * @tie
 * @route POST /login
 * @title 登录
 * @des 接口说明
 * @body {string} username 用户名
 * @body {string} password 密码
 * @response {object} data 用户数据
 * @response {string} token Token
 * @example example/login
 * **/
function Login () {}

/**
 * @param {number} key
 * **/

/** sdf **/
// const code = fs.readFileSync('./demo.js', 'utf-8')

// const tie = new lib.Tie()

// const data = tie.parse(code)
// fs.writeFileSync('./demo.json', JSON.stringify(tie.toRequest(code), null, 2))
// // console.log(data)
// const md = tie.toMarkdown(code)
// console.log(md)
// fs.writeFileSync('./demo.md', md)

// tie.parseKey({ symbol: 'key1', text: '{number} page' })
// tie.parseKey({ symbol: 'key1', text: '{number}  page  页码' })
// tie.parseKey({ symbol: 'key2', text: '{number} [page] 页码' })
// tie.parseKey({ symbol: 'key2', text: '{number} [page=1] 页码' })


lib.parse(path.resolve(__dirname, './'), path.resolve(__dirname, './docs'), {
    disableDest: false,
    ignore: [
        'node_modules/**/*.js'
    ],
    // fn (req) {
    //     console.log(req)
    //     return '# hello'
    // }
}).then(data => {
    console.log(data)
})

