const _ = require('lodash')

// Generate random 6-char alphanumeric string
exports.generateRandomString = (length) => {
    return Math.random().toString(36).substring(2, length + 2)
}

// TODO Pass db as first parameter
// Find all URLS created by one user
exports.findUserURLS = (db, userId) => {
    let userURL = {}
    
    for (let url in db.urlDatabase) {
        if (db.urlDatabase[url].userID === userId) {
            userURL[url] = db.urlDatabase[url]
        }
    }

    return userURL
}

exports.trackUniqueUser = (req, url) => {

    if(req.session.unique_id) {
        url.uniques.unshift([req.session.unique_id, _.now()])

    } else {
        const unique_id = exports.generateRandomString(10)
        req.session.unique_id = unique_id
        url.uniques.unshift([unique_id, _.now()])
    }
}

exports.filterUniques = (url) => {

    const total = []

    url.uniques.forEach(e => {
        if (!total.includes(e[0])) total.push(e[0])
    })

    return total.length
}
