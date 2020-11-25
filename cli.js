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
    .arguments('<entry>')
    .option('--dest <dir>', 'output folder')
    .option('--log [enable]', 'enable logs', '0')
    .option('--match <pattern>', 'match pattern', '**/*.js')
    .option('-i --ignore <file>', 'ignore file', 'node_modules/**/*.js')
    .option('-b --bundle <file>', 'bundle handler javascript file')
    .option('--json [filename]', 'output json to file')
    // .option('-c --config <file>', 'Specify configuration file.')
    .parse(process.argv)

async function main() {
    if (!program.args[0]) {
        program.help()
        process.exit(0)
    }
    const entry = path.isAbsolute(program.args[0])
        ? program.args[0]
        : path.resolve(process.cwd(), program.args[0])
    const dest = !program.dest ? undefined : path.isAbsolute(program.dest)
        ? program.dest
        : path.resolve(process.cwd(), program.dest)

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
        const bundleFile = path.isAbsolute(program.bundle)
            ? program.bundle
            : path.resolve(process.cwd(), program.bundle)
        try {
            bundle = require(bundleFile)
            // if (!bundle || typeof bundle.render !== 'function') {
            //     console.error('Bundle handler file must be a js file and export {render: async () => string;}')
            //     process.exit(1)
            // }
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
            if (+program.log === 1) {
                console.log(`[tie]: ${file.file} ${file.chunks.length}`)
            }
        }
    })

    if (output) {
        const arr = data.map(e => {
            delete e.file
            return e
        })
        fs.writeFileSync(dest ? path.resolve(dest, output) : output, JSON.stringify(arr))
    }
}

main()
