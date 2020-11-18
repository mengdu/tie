#!/usr/bin/env node
const path = require('path')
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

    if (program.match) {
        pattern = program.match
    }

    if (program.ignore) {
        ignore = [ program.ignore ]
    }

    lib.parse(entry, {
        dest: dest,
        pattern: pattern,
        ignore: ignore,
        fn (file) {
            console.log(`${file.file} ${file.apis.length}`)
        }
    })
}

main()
