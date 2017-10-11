const _ = require('lodash')

// Generate random 6-char alphanumeric string
exports.generateRandomString = (length) => {
    return Math.random().toString(36).substring(2, length + 2)
}

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

exports.verifyHttp = (str) => {

    if (!/^(f|ht)tps?:\/\//i.test(str)) {
        str = "http://" + str
    }

    return str
}

// TODO Maintain this helper or go back to if-else?
exports.authenticateUser = (req, res, redirect) => {
    if (!req.session.user_id) {
        if (redirect === undefined) {
            res.status(403).send("Access denied.")
        } else {
            res.redirect(302, redirect)
        }
    }
}