
// Generate random 6-char alphanumeric string
exports.generateRandomString = () => {
    return Math.random().toString(36).substring(2, 8)
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