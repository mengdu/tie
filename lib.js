
function toMarkdown (request) {
    const arr = []
    if (request.title) {
        arr.push(`### ${request.title}\n`)
    }

    if (request.tags) {
        arr.push(request.tags.split(',').map(e => `\`${e}\``).join(', ') + '\n')
    }

    if (request.path) {
        arr.push(`\`\`\`\n${(request.method || 'GET').toUpperCase()} ${request.path}\n\`\`\`\n`)
    }

    if (request.description) {
        arr.push(`${request.description}\n`)
    }

    if (request.changes.length > 0) {
        arr.push(`**Changes:**\n`)
        arr.push(request.changes.map(e => `+ ${e}`).join('\n') + '\n')
    }

    if (request.headers && request.headers.length > 0) {
        arr.push('#### Headers')
        const tabls = [
            `| Key | Type | Required | Default | Description |`,
            `| :-----| :---- | :----: | :---- | :---- |`,
        ]
        request.headers.forEach(item => {
            const defaultValue = item.defaultValue === undefined ? '—' : `\`${item.defaultValue}\``
            tabls.push(`| ${item.key} | ${item.type} | ${item.optional ? 'False' : 'True'} | ${defaultValue} | ${item.des} |`)
        })

        arr.push('\n' + tabls.join('\n') + '\n')
    }

    if (request.query && request.query.length > 0) {
        arr.push('#### Query')
        const tabls = [
            `| Key | Type | Required | Default | Description |`,
            `| :-----| :---- | :----: | :---- | :---- |`,
        ]
        request.query.forEach(item => {
            const defaultValue = item.defaultValue === undefined ? '—' : `\`${item.defaultValue}\``
            tabls.push(`| ${item.key} | ${item.type} | ${item.optional ? 'False' : 'True'} | ${defaultValue} | ${item.des} |`)
        })

        arr.push('\n' + tabls.join('\n') + '\n')
    }

    if (request.body && request.body.length > 0) {
        arr.push('#### Body')
        if (request.type) {
            arr.push(`\n\`Content-Type: ${request.type}\``)
        }
        const tabls = [
            `| Key | Type | Required | Default | Description |`,
            `| :-----| :---- | :----: | :---- | :---- |`,
        ]
        request.body.forEach(item => {
            const defaultValue = item.defaultValue === undefined ? '—' : `\`${item.defaultValue}\``
            tabls.push(`| ${item.key} | ${item.type} | ${item.optional ? 'False' : 'True'} | ${defaultValue} | ${item.des} |`)
        })

        arr.push('\n' + tabls.join('\n') + '\n')
    }

    if (request.response && request.response.length > 0) {
        arr.push('#### Response')
        const tabls = [
            `| Key | Type | Description |`,
            `| :-----| :---- | :---- |`,
        ]
        request.response.forEach(item => {
            tabls.push(`| ${item.key} | ${item.type} | ${item.des} |`)
        })

        arr.push('\n' + tabls.join('\n') + '\n')
    }

    if (request.codes.length > 0) {
        arr.push('**Errcode:**\n')
        arr.push(request.codes.map(e => `+ \`${e}\``).join('\n') + '\n')
    }

    if (request.author) {
        arr.push('#### Contact\n')
        arr.push(request.author.split(',').map(e => `+ [${e}](#)`).join('\n') + '\n')
    }

    return arr.join('\n')
}

class Tie {
    constructor (tag) {
        this.TAG = tag || 'tie'
    }

    /**
     * 解析
     * @param {string} text
     * **/
    parse (text) {
        // /\/\*\*\W*\*\W*tie\W?[\w\W]*?\*\*\//g
        const reg = new RegExp(`\\/\\*\\*\\W*\\*\\W*@${this.TAG}\W?[\\w\\W]*?\\*\\*\\/`, 'g')
        const chunks = text.match(reg)

        if (chunks === null) return []

        const arr = chunks.map(e => {
            const lines = e.split(/\n/).map(line => {
                let data = { raw: line }
                // @symbol {type} [key] - des
                line.replace(/@(\w*) +(.*)/, function (raw, symbol, text) {
                    data = { raw, symbol, text: text.trim() }
                })
                const value = this.parseKey(data)
                return {
                    ...data,
                    value: value
                }
            })
            return lines
        })

        return arr
    }

    /**
     * @param {string} symbol
     * @param {string} text
     * **/
    parseKey ({ text }) {
        if (!text) return null

        let data = null

        text.replace(/\{(.+)\} +(.+)/, function () {
            const type = arguments[1]
            const arr = arguments[2].split(/ +/)
            let key = arr[0].trim()
            let defaultValue = undefined
            let optional = false

            if (/\[.+\]/.test(key)) {
                key = key.replace(/^\[|\]$/g, '')
                optional = true
            }

            if (key && key.indexOf('=') > -1) {
                [key, defaultValue = ''] = key.split('=')
            }
            const des = arr.splice(1).join(' ')
            data = { type, key, des: (des || '').trim() || '', optional: optional, defaultValue: defaultValue }
        })

        if (data === null) {
            text.replace(/(.+) (.*)/, function () {
                data = [arguments[1], arguments[2]]
            })
        }

        return data
    }

    toRequest (text) {
        const arr = this.parse(text).map(lines => {
            const request = {
                title: '',
                description: '',
                method: '',
                path: '',
                type: '',
                query: [],
                body: [],
                headers: [],
                response: [],
                codes: [], // 响应错误码列表
                changes: [], // 改动过说明
                examples: []
            }
            for (const i in lines) {
                const line = lines[i]
                switch (line.symbol) {
                    case 'title':
                        request.title = line.text
                        break
                    case 'route':
                        request.method = line.value[0]
                        request.path = line.value[1]
                        break
                    case 'type':
                        request.type = line.text
                        break
                    case 'des':
                        request.description = line.text
                        break
                    case 'example':
                        request.examples.push(line.text)
                        break
                    case 'header':
                        request.headers.push(line.value)
                        break
                    case 'query':
                        request.query.push(line.value)
                        break
                    case 'body':
                        request.body.push(line.value)
                        break
                    case 'response':
                        request.response.push(line.value)
                        break
                    case 'author':
                        request.author = line.text
                        break
                    case 'version':
                        request.version = line.text
                        break
                    case 'code':
                        request.codes.push(...line.text.split(','))
                        break
                    case 'tags':
                        request.tags = line.text
                        break
                    case 'change':
                        request.changes.push(line.text)
                        break
                    default:
                        if (!Array.isArray(request.others)) {
                            request.others = []
                        }
                        if (line.text) {
                            request.others.push({ symbol: line.symbol, value: line.text })
                        }
                }
            }

            return request
        })

        return arr
    }

    toMarkdown (text) {
        return this.toRequest(text).map(request => {
            request.markdown = toMarkdown(request)
            return request
        })
    }
}

module.exports = Tie
