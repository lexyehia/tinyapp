const tools  = require('../helpers/tools'),
      Model  = require('../db/model'),
      _      = require('lodash')

class URL extends Model {

    // TODO: Fix this, it returns a redirect to undefined
    static create(user, longURL) {

        let url       = new URL()
        url.url       = longURL
        url.userID    = user
        url.redirects = 0
        url.uniques   = []

        url.save()
        return url
        
    }

    save() {
        if (!/^(f|ht)tps?:\/\//i.test(this.url)) {
            this.url = "http://" + this.url
        }
        super.save()
    }

    trackVisit(session) {
        this.redirects++
        
        if (session.unique_id) {
            this.uniques.unshift([
                session.unique_id, 
                Date.now()
            ])
        } else {
            const uniqueID    = tools.generateRandomString(12)
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