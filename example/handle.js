// bundle.js

// Custom rendering handler
exports.render = async function (requests, file, filename) {
    console.log(requests)

    // Redefining rendering
    return '# Hi'
}

// Do something else when you're done
exports.done = async function (files) {
    console.log(files.length)
}
