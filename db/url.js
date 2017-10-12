const tools  = require('../helpers/tools'),
      urlDB  = require('./db').urlDatabase,
      Model  = require('./db').Model,
      _      = require('lodash')

class Url extends Model {
    
    constructor(user, longURL) {
        if (!/^(f|ht)tps?:\/\//i.test(longURL)) {
            longURL = "http://" + longURL
        }

        this.url        = longURL
        this.userID     = user
        this.redirects  = 0
        this.uniques    = []

        if (this.save()) {
            return this
        } else {
            return false
        }
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

        this.save()
    }

    getTotalUniqueVisitors() {
        return _.uniq(this.uniques.map(e => e[0])).length
    }
}

module.exports = Url