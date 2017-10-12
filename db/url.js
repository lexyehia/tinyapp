const tools  = require('../helpers/tools'),
      Model  = require('./model'),
      _      = require('lodash')

class URL extends Model {

    static create(user, longURL) {
        if (!/^(f|ht)tps?:\/\//i.test(longURL)) {
            longURL = "http://" + longURL
        }

        let url = new URL()
        url.url        = longURL
        url.userID     = user
        url.redirects  = 0
        url.uniques    = []

        if (url.save()) {
            return url
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

module.exports = URL