const fs = require('fs')
const path = require('path')
const glob = require('glob')
const util = require('util')
const lib = require('./lib')

async function parse (entry, dest, options) {
    if (!options) options = {}
    const files = await util.promisify(glob)(options.pattern || '**/**.js', {
        cwd: entry,
        ignore: options.ignore || []
    })

    if (!options.disableDest && !fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true })
    }

    const tie = new lib()
    const arr = []
    for (const i in files) {
        const filename = files[i]
        const file = path.resolve(entry, filename)
        const code = await util.promisify(fs.readFile)(file, { encoding: 'utf-8' })
        const md = tie.toMarkdown(code, options.fn)

        arr.push({
            file,
            filename,
            text: md
        })

        if (!options.disableDest && md) {
            await util.promisify(fs.writeFile)(path.resolve(dest, filename.replace(path.extname(filename), '.md')), md)
        }
    }
    return arr
}

module.exports = {
    Tie: lib,
    parse
}
