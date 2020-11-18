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
 * @author lanyueos@qq.com,ohter@gmail.com
 * @version 1.0
 * @code 0,10,200
 * @tags login,sign-in
 * @change Add feature 1 (2020-11-17)
 * @change Add feature 2 (2020-11-18)
 * @route POST /test
 * @title Sign In
 * @des Log on user
 * @query {number} [page=1] Page number
 * @query {number} [page=] Page size
 * @query {number} [pageSize=10] Page size
 * @body {string} username Username
 * @body {string} password Password
 * @response {object} data User Profile
 * @response {string} token Session Token
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


lib.parse(path.resolve(__dirname, './'), {
    dest: path.resolve(__dirname, './docs'),
    ignore: [
        'node_modules/**/*.js'
    ],
    // fn (req) {
    //     console.log(req)
    // }
}).then(data => {
    console.log(data)
    fs.writeFileSync(path.resolve(__dirname, './data.json'), JSON.stringify(data))
})

// t = new lib.Tie()

// const data = t.toRequest(`

// `)

// console.log(data[0])
