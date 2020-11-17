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

    if (options.dest && !fs.existsSync(options.dest)) {
        fs.mkdirSync(options.dest, { recursive: true })
    }

    const tie = new lib()
    const arr = []
    for (const i in files) {
        const filename = files[i]
        const file = path.resolve(entry, filename)
        const code = await util.promisify(fs.readFile)(file, { encoding: 'utf-8' })
        const chunks = tie.toMarkdown(code)
        const meta = `---\nfilename: ${filename}\ndate: ${Date.now()}\n---`
        let markdown = chunks.map(e => e.markdown).join('\n')
        
        if (markdown) {
            markdown = meta + '\n\n' + markdown
        }
    
        const item = {
            file,
            filename,
            chunks: chunks,
            markdown: markdown
        }

        arr.push(item)

        if (options.dest && markdown) {
            const docFile = path.resolve(options.dest, filename.replace(path.extname(filename), '.md'))
            await util.promisify(fs.writeFile)(docFile, markdown)
        }

        if (typeof options.fn === 'function') {
            options.fn(item)
        }
    }
    return arr
}

module.exports = {
    Tie: lib,
    parse
}
