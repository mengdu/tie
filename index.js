const fs = require('fs')
const path = require('path')
const glob = require('glob')
const util = require('util')
const lib = require('./lib')

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
        let apis = []

        if (options.bundle && typeof options.bundle.render === 'function') {
            apis = await Promise.all(tie.toRequest(code).map(async e => {
                e.markdown = await options.bundle.render(e)
                return e
            }))
        } else {
            apis = tie.toMarkdown(code)
        }

        const meta = `---\nfilename: ${filename}\ndate: ${Date.now()}\n---`
        let markdown = apis.map(e => e.markdown).join('\n')
        
        if (markdown) {
            markdown = meta + '\n\n' + markdown
        }
    
        const item = {
            file,
            filename,
            apis: apis,
            markdown: markdown
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
