# Tie

Library for interface description extraction.

## CLI

```
tie controller docs --match="**/*.js" --ignore="node_modules/**/*"
```

> The interface description under the 'controller' folder will be extracted and documents will be generated to the 'docs' folder.

```
Usage: tie [options] <entry> <dest>

Extracting description to generate markdown document.

Options:
  -V, --version       output the version number
  --match <pattern>   Match pattern (default: "**/*.js")
  -i --ignore <file>  Ignore file (default: "node_modules/**/*.js")
  -b --bundle <file>  Javascript bundle handler
  --json [filename]   Output json to file
  -h, --help          display help for command
```

bundle.js

```js
// bundle.js
exports.render = async function (request) {
	console.log(request)
	return '# Hi'
}

exports.done = async function (files) {
	console.log(files.length)
}
```

## Pattern

+ `@tie` 标记接口，放在开头
+ `@title` 接口名称
+ `@des` 接口说明
+ `@tags` 标签，多个逗号分隔
+ `@author` 作者，多个逗号分隔
+ `@version` 版本
+ `@route` 路由定义
+ `@type` Body 类型说明
+ `@header` Header 键值对；可以多个
+ `@query` Query 键值对；可以多个
+ `@body` Body 键值对；可以多个
+ `@response` 响应字段说明；可以多个
+ `@code` 响应错误码，多个逗号分隔
+ `@change` 接口变更记录，可以多个
+ `@example` 请求案例说明

**e.g**

```js
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
```

Will be generated

````markdown

### Sign In

`login`, `sign-in`

```
POST /test
```

Log on user

**Changes:**

+ Add feature 1 (2020-11-17)
+ Add feature 2 (2020-11-18)

#### Query

| Key | Type | Required | Default | Description |
| :-----| :---- | :----: | :---- | :---- |
| page | number | False | `1` | Page number |
| page | number | False | `` | Page size |
| pageSize | number | False | `10` | Page size |

#### Body

| Key | Type | Required | Default | Description |
| :-----| :---- | :----: | :---- | :---- |
| username | string | True | — | Username |
| password | string | True | — | Password |

#### Response

| Key | Type | Description |
| :-----| :---- | :---- |
| data | object | User Profile |
| token | string | Session Token |

**Errcode:**

+ `0`
+ `10`
+ `200`

#### Contact

+ [lanyueos@qq.com](#)
+ [ohter@gmail.com](#)

````
