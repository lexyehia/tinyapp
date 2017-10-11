const tools  = require('../helpers/tools'),
      urlDB  = require('./db').urlDatabase,
      _      = require('lodash')

class Url {
    constructor(user, longURL) {
        if (!/^(f|ht)tps?:\/\//i.test(longURL)) {
            longURL = "http://" + longURL
        }

        this.id         = tools.generateRandomString(6)        
        this.url        = longURL
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

    trackVisit(session) {
        this.redirects++
        
        if (session.unique_id) {
            this.uniques.unshift([
                session.unique_id, 
                Date.now()
            ])
        } else {
            const uniqueID = tools.generateRandomString(12)
            session.unique_id = uniqueID
            this.uniques.unshift([
                uniqueID, 
                Date.now()
            ])
        }
    }

    getTotalUniqueVisitors() {
        return _.uniq(this.uniques.map(e => e[0])).length
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