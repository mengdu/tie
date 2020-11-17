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
  -h, --help          display help for command
```

## Pattern

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

**e.g**

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

Will be generated

````markdown

### 接口名称

```
GET /
```

接口说明

#### Headers

| Key | Type | Required | Description |
| :-----| :---- | :----: | :---- |
| token | string | False | Token |
| Content-Type | string | True | 类型 |

#### Query

| Key | Type | Required | Description |
| :-----| :---- | :----: | :---- |
| page | number | False | 页码 |
| pageSize | number | False | 页码 |

#### Body

`Content-Type: json`

| Key | Type | Required | Description |
| :-----| :---- | :----: | :---- |
| id | number | True | 用户id |
| uid | number | True | 用户uid |

#### Response

| Key | Type | Description |
| :-----| :---- | :---- |
| data | object | 用户数据 |

````
