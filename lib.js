
class Tie {
    constructor () {
        this.TAG = 'tie'
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
                let data = {}
                // @symbol {type} [key] - des
                line.replace(/@(\w*) +(.*)/, function (raw, symbol, text) {
                    data = { raw, symbol, text }
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

            data = { type, key, des: (arr[1] || '').trim() || '', optional: optional, defaultValue: defaultValue }
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
                query: [],
                body: [],
                headers: [],
                response: [],
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
                    default:
                        if (!Array.isArray(request.ext)) {
                            request.ext = []
                        }
                        if (line.value) {
                            request.ext.push({ symbol: line.symbol, value: line.text })
                        }
                }
            }

            return request
        })

        return arr
    }

    toMarkdown (text, fn) {
        return this.toRequest(text).map(request => {
            if (fn && typeof fn === 'function') {
                return fn(request)
            }

            const arr = []
            if (request.title) {
                arr.push(`### ${request.title}\n`)
            }

            if (request.path) {
                arr.push(`\`\`\`\n${(request.method || 'GET').toUpperCase()} ${request.path}\n\`\`\`\n`)
            }

            if (request.description) {
                arr.push(`${request.description}\n`)
            }

            if (request.headers && request.headers.length > 0) {
                arr.push('#### Headers')
                const tabls = [
                    `| Key | Type | Required | Description |`,
                    `| :-----| :---- | :----: | :---- |`,
                ]
                request.headers.forEach(item => {
                    tabls.push(`| ${item.key} | ${item.type} | ${item.optional ? 'False' : 'True'} | ${item.des} |`)
                })

                arr.push('\n' + tabls.join('\n') + '\n')
            }

            if (request.query && request.query.length > 0) {
                arr.push('#### Query')
                const tabls = [
                    `| Key | Type | Required | Description |`,
                    `| :-----| :---- | :----: | :---- |`,
                ]
                request.query.forEach(item => {
                    tabls.push(`| ${item.key} | ${item.type} | ${item.optional ? 'False' : 'True'} | ${item.des} |`)
                })

                arr.push('\n' + tabls.join('\n') + '\n')
            }

            if (request.body && request.body.length > 0) {
                arr.push('#### Body')
                if (request.type) {
                    arr.push(`\n\`Content-Type: ${request.type}\``)
                }
                const tabls = [
                    `| Key | Type | Required | Description |`,
                    `| :-----| :---- | :----: | :---- |`,
                ]
                request.body.forEach(item => {
                    tabls.push(`| ${item.key} | ${item.type} | ${item.optional ? 'False' : 'True'} | ${item.des} |`)
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

            return arr.join('\n')
        }).join('\n\n')
    }
}

module.exports = Tie
