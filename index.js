const fs = require('fs')
const path = require('path')
const glob = require('glob')
const util = require('util')
const lib = require('./lib')

/**
 * @param {string} entry
 * @param {{pattern?: string; dest?: string; bundle?: { render?: () => Promise<string>; done?: () => Promise<void>; };}} [options]
 * **/
async function parse (entry, options) {
    if (!options) options = {}
    const files = await util.promisify(glob)(options.pattern || '**/**.js', {
        cwd: entry,
        ignore: options.ignore || []
    })

    const tie = new lib()
    const arr = []

    for (const i in files) {
        const filename = files[i]
        const file = path.resolve(entry, filename)
        const code = await util.promisify(fs.readFile)(file, { encoding: 'utf-8' })
        const apis = tie.toMarkdown(code)
        const metaArr = [
            { key: 'filename', value: filename },
            { key: 'createdAt', value: Date.now() }
        ]
        const meta = {}

        // 取 meta
        for (const j in apis) {
            if (apis[j].chunkType === 'meta') {
                apis[j].raw.filter(e => e.symbol).forEach(e => {
                    metaArr.push({ key: e.symbol, value: e.text })
                })
            }
        }

        const metaMarkdown = metaArr.map(e => {
            meta[e.key] = e.value
            return `${e.key}: ${e.value}`
        }).join('\n')

        let markdown = ''

        if (options.bundle && typeof options.bundle.render === 'function') {
            markdown = await options.bundle.render(apis, filename, file)
        } else {
            markdown = apis.filter(e => e.chunkType !== 'meta').map(e => e.markdown).join('\n')
            markdown = metaMarkdown ? `---\n${metaMarkdown}\n---\n\n` + markdown : markdown
        }
    
        const item = {
            file,
            filename,
            apis: apis,
            markdown: markdown,
            meta
        }

        arr.push(item)

        if (options.dest && markdown) {
            const docFile = path.resolve(options.dest, filename.replace(path.extname(filename), '.md'))
            const dir = path.dirname(docFile)
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true })
            }
            await util.promisify(fs.writeFile)(docFile, markdown)
        }

        if (typeof options.fn === 'function') {
            options.fn(item)
        }
    }

    if (options.bundle && typeof options.bundle.done === 'function') {
        await options.bundle.done(arr)
    }

    return arr
}

module.exports = {
    Tie: lib,
    parse
}
