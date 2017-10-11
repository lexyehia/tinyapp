const tools  = require('../helpers/tools'),
      userDB = require('./db').userDatabase,
      bcrypt = require('bcrypt')

class User {
    constructor(email, password) {
        if (!email || !password) return false

        for (let user in userDB) {
            if (email === userDB[user].email) return false
        }

        this.id         = tools.generateRandomString(6)        
        this.email      = email
        this.password   = bcrypt.hashSync(password, 10)
        userDB[this.id] = this

        return userDB[this.id]
    }

    update() {
        let user      = userDB[this.id]
        user.email    = this.email
        if (user.password !== this.password) {
            user.password = bcrypt.hashSync(password, 10)
        }
        return userDB[this.id]
    }

    destroy() {
        return delete userDB[this.id]
    }

    static retrieve(email, password) {
        if (!email || !password) return false

        let userFound = null        
        for (let user in userDB) {
            if (userDB[user].email === email && bcrypt.compareSync(password, userDB[user].password)) {
                userFound = userDB[user]
                break
            }
        }

        return userFound
    }

    static all() {
        return userDB
    }

    static find(id) {
        return userDB[id]
    }

    static destroy(id) {
        return delete userDB[id]
    }
}

module.exports = User