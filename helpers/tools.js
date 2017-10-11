// Generate random 6-char alphanumeric string
exports.generateRandomString = (length) => {
    return Math.random().toString(36).substring(2, length + 2)
}