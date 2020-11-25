// bundle.js

// Custom rendering handler
exports.render = async function ({ chunks, file, filename, meta, metaMarkdown }) {
    console.log(file)

    // Redefining rendering
    return '# Hi'
}

// Do something else when you're done
exports.done = async function (files) {
    console.log(files.length)
}
