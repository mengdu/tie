#!/usr/bin/env node
const path = require('path')
const fs = require('fs')
const { Command } = require('commander')
const pkg = require('./package.json')
const lib = require('./index')

const program = new Command()

program
    .name('tie')
    .version(pkg.version)
    .description('Extracting description to generate markdown document.')
    .arguments('<entry> <dest>')
    .option('--match <pattern>', 'Match pattern', '**/*.js')
    .option('-i --ignore <file>', 'Ignore file', 'node_modules/**/*.js')
    .option('-b --bundle <file>', 'Bundle handler javascript file')
    .option('--json [filename]', 'Output json to file')
    // .option('-c --config <file>', 'Specify configuration file.')
    .parse(process.argv)

async function main() {
    if (!program.args[0] || !program.args[1]) {
        program.help()
        process.exit(0)
    }
    const entry = path.isAbsolute(program.args[0])
        ? program.args
        : path.resolve(process.cwd(), program.args[0])
    const dest = path.isAbsolute(program.args[1])
        ? program.args
        : path.resolve(process.cwd(), program.args[1])

    let pattern = undefined
    let ignore = undefined
    let bundle = undefined
    let output = program.json === true ? 'data.json' : program.json

    if (program.match) {
        pattern = program.match
    }

    if (program.ignore) {
        ignore = [ program.ignore ]
    }

    if (program.bundle) {
        try {
            bundle = require(program.bundle)
            if (!bundle || typeof bundle.render !== 'function') {
                console.error('Bundle handler file must be a js file and export {render: (req) => string;}')
                process.exit(1)
            }
        } catch (err) {
            console.error(err.message)
            process.exit(1)
        }
    }
    
    const data = await lib.parse(entry, {
        dest: dest,
        pattern: pattern,
        ignore: ignore,
        bundle: bundle,
        fn (file) {
            console.log(`${file.file} ${file.apis.length}`)
        }
    })

    if (output) {
        fs.writeFileSync(path.resolve(dest, output), JSON.stringify(data))
    }
}

main()
