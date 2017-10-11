const tools  = require('../helpers/tools'),
      urlDB  = require('./db').urlDatabase

class Url {
    constructor(user, longURL) {
        this.id         = tools.generateRandomString(6)        
        this.url        = tools.verifyHttp(longURL)
        this.userID     = user
        this.redirects  = 0
        this.uniques    = []
        urlDB[this.id]  = this
        return urlDB[this.id]
    }

    update() {
        let url       = urlDB[this.id]
        url.url       = this.url
        url.userID    = this.userID
        url.redirects = this.redirects
        url.uniques   = this.uniques
        return url
    }

    destroy() {
        return delete urlDB[this.id]
    }

    static all() {
        return urlDB
    }

    static find(id) {
        return urlDB[id]
    }

    static destroy(id) {
        return delete urlDB[id]
    }
}

module.exports = Url