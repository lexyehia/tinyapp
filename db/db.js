const fs = require('fs');
const _  = require('lodash');
const tools = require('../helpers/tools')
const path = require('path')

const dbPath = path.resolve(__dirname, "db.json")

exports.urlDatabase = {
    "b2xVn2": {
        url: "http://www.lighthouselabs.ca",
        userID: "342242",
        redirects: 0,
        uniques: []
    },
    "9sm5xK": {
        url: "http://www.google.com",
        userID: "342242",
        redirects: 0,
        uniques: []
    }
}

exports.userDatabase = {
    "342242": {
        id: "342242",
        email: "bob@doyle.com",
        password: "blabla"
    }
}

class Model {
    static connect() {
        return JSON.parse(fs.readFileSync(dbPath))
    }

    static all() {
        return this.connect()[this.name.toLowerCase() + "s" + "DB"]
    }

    static find(query) {
        let db    = this.connect()
        let table = db[this.name.toLowerCase() + "s" + "DB"]
        let obj   = null

        if (typeof query === 'string' || typeof query === 'number') {
            obj = table.filter(e => e.id === query)[0]
        } else if (typeof query === 'object') {
            obj = _.find(table, query)
        } else {
            throw Error("Improper query format")
        }

        if (obj) {          
            return _.assign(new this(), obj)
        } else {
            return null
        }
    }

    static findAll(query) {
        let db    = this.connect()
        let table = db[this.name.toLowerCase() + "s" + "DB"]
        return _.filter(table, query)            
    }

    static destroy(id) {
        let db    = this.connect()
        let table = db[this.name.toLowerCase() + "s" + "DB"]
        let obj   = table.filter(e => e.id === id)[0]

        if (obj) {
            table = table.filter(e => e !== obj)
            fs.writeFileSync(dbPath, JSON.stringify(db))            
            return true
        } else {
            return false
        }
    }

    save() {
        let db    = this.constructor.connect()
        let table = db[this.constructor.name.toLowerCase() + "s" + "DB"]
        let obj   = table.filter(e => e.id === this.id)[0]

        if (obj) {
            table[table.indexOf(obj)] = this
        } else {
            this.id = tools.generateRandomString(6)
            table.push(this)
        }

        try {
            fs.writeFileSync(dbPath, JSON.stringify(db))
            return this
        } catch (err) {
            return null
        }
    }

    retrieveDBCopy() {
        let db    = this.constructor.connect()
        let table = db[this.constructor.name.toLowerCase() + "s" + "DB"]
        let obj   = table.filter(e => e.id === this.id)[0]

        if (obj) {          
            return obj
        } else {
            return null
        }
    }

    destroy() {
        let db    = this.constructor.connect()
        let table = db[this.constructor.name.toLowerCase() + "s" + "DB"]
        let obj   = table.filter(e => e.id === this.id)[0]

        if (obj) {
            table = table.filter(e => e !== obj)
            fs.writeFileSync(dbPath, JSON.stringify(db))            
            return true
        } else {
            return false
        }
    }
}

module.exports = {
    Model: Model
}