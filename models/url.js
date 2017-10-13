const tools  = require('../helpers/tools'),
      Model  = require('../db/model'),
      _      = require('lodash')

/**
 * The URL class, instances of this class would model to a document
 * in the database, and persist when invoking the Model.save() method
 * 
 * @class URL
 * @extends {Model}
 */
class URL extends Model {

    /**
     * Create a new instance of URL and persist to database
     * 
     * @static
     * @param {number} user 
     * @param {string} longURL 
     * @returns {URL} new object
     * @memberof URL
     */
    static create(user, longURL) {

        let url       = new URL()
        url.url       = longURL
        url.userID    = user
        url.redirects = 0
        url.created   = new Date()
        url.uniques   = []

        url.save()
        return url
    }

    /**
     * Override base Model.save() to make sure 'http://' is 
     * part of the url string
     * 
     * @memberof URL
     */
    save() {
        if (!/^(f|ht)tps?:\/\//i.test(this.url)) {
            this.url = "http://" + this.url
        }
        super.save()
    }

    /**
     * When invoked by a URL object, it increments the object's 'redirects' 
     * property, verifies if the redirected user has a tracking cookie, and 
     * adds the tracked user's unique cookie ID and timestamp into the object's 
     * 'uniques' property
     * 
     * @param {any} session 
     * @memberof URL
     */
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

    /**
     * Counts the number of unique entries in the 'uniques' property array to 
     * return the number of unique visitors of a particular URL object
     * 
     * @returns {number}
     * @memberof URL
     */
    getTotalUniqueVisitors() {
        return _.uniq(this.uniques.map(e => e[0])).length
    }
}

module.exports = URL