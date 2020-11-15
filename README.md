# Tie

Library for interface description extraction.

## Pattern

```js
/**
 * @tie
 * @title 接口名称
 * @des 接口说明
 * @route GET /
 * @type json
 * @header {string} [token] Token
 * @header {string} Content-Type 类型
 * @query {number} [page=1] 页码
 * @query {number} [pageSize=10] 页码
 * @body {number} id 用户id
 * @body {number} uid 用户uid
 * @response {object} data 用户数据
 * @example example/index
 * **/
function func () {}
```

+ `@tie` 标记接口，放在开头
+ `@title` 接口名称
+ `@des` 接口说明
+ `@route` 路由定义
+ `@type` Body 类型说明
+ `@header` Header 键值对；可以多个
+ `@query` Query 键值对；可以多个
+ `@body` Body 键值对；可以多个
+ `@response` 响应字段说明；可以多个
+ `@example` 请求案例说明
