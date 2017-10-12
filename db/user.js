const tools  = require('../helpers/tools'),
      URL    = require('./url'),
      Model  = require('./model'),
      bcrypt = require('bcrypt')

class User extends Model {

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

    static verifyPassword(email, password) {
        if (!email || !password) return false

        const user = this.find({email: email})

        if (user && bcrypt.compareSync(password, user.password)) {
            return user
        } else {
            return false
        }
    }

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

    urls() {
        return URL.findAll({userID: this.id})
    }

    // Future use
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