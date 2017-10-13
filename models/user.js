const tools  = require('../helpers/tools'),
      URL    = require('./url'),
      Model  = require('../db/model'),
      bcrypt = require('bcrypt')

/**
 * The User class, instances of this class would model to a document
 * in the database, and persist when invoking the Model.save() method
 * 
 * @class User
 * @extends {Model}
 */
class User extends Model {

    /**
     * Creates a new User object and persists it to the database
     * 
     * @static
     * @param {string} email 
     * @param {string} password 
     * @returns {User} new object
     * @memberof User
     */
    static create(email, password) {
        if (!email || !password) return false
        if (User.find({email: email})) return false

        let user      = new User()
        user.id       = tools.generateRandomString(6)
        user.email    = email
        user.password = bcrypt.hashSync(password, 10)

        if (user.save()) {
            return user
        } else {
            return false
        }
    }

    /**
     * Verifies that a particular user exists by looking them up by email, then 
     * compares passwords. If successful, returns the found user as a User 
     * object
     * 
     * @static
     * @param {string} email 
     * @param {string} password 
     * @returns {User} object
     * @memberof User
     */
    static verifyPassword(email, password) {
        if (!email || !password) return false

        const user = this.find({email: email})

        if (user && bcrypt.compareSync(password, user.password)) {
            return user
        } else {
            return false
        }
    }

    /**
     * Takes the session property of the 'request' object, checks whether there 
     * is a 'user_id' cookie set, checks if it's valid by looking up the id in 
     * the database and returns that User object. If invalid, it removes the 
     * invalid cookie from the browser and returns false.
     * 
     * @static
     * @param {req.session} session 
     * @returns {User|false}
     * @memberof User
     */
    static verifySession(session) {

        if (!session.user_id) {
            return false
        } else {
            let user = this.find(session.user_id)
            if (user) {
                return user
            } else {
                session.user_id = null
                return false
            }
        }
    }

    /**
     * Provides an array of the invoking User object's related URLS
     * 
     * @returns {Array} URL objects
     * @memberof User
     */
    urls() {
        return URL.findAll({userID: this.id})
    }

    destroy() {
        this.urls().forEach(e => e.destroy())
        super.destroy()
    }

    /**
     * Updates the User object, making sure to check if password has changed 
     * first before updating it on the database-side
     * 
     * @returns {User}
     * @memberof User
     */
    update() {
        const _user = this.retrieveDBCopy()
        
        if (this.password !== _user.password) {
            this.password = bcrypt.hashSync(this.password, 10)
        }

        if (this.save()) {
            return this            
        } else {
            return false
        }
    }
}

module.exports = User
