
exports.generateRandomString = () => {
    return Math.random().toString(36).substring(2, 8)
}

exports.findUserURLS = (userId) => {
    let userURL = {}
    
    for (let url in urlDatabase) {
        if (urlDatabase[url].userID === userId) {
            userURL[url] = urlDatabase[url]
        }
    }

    return userURL
}