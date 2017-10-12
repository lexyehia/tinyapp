const fs    = require('fs'),
      _     = require('lodash'),
      path  = require('path'),
      tools = require('../helpers/tools')

const dbPath = path.resolve(__dirname, "db.json")

class Model {
    static connect() {
        return JSON.parse(fs.readFileSync(dbPath))
    }

    static all() {
        console.log("FETCHING ALL OBJECTS FROM DB " + this._getDBName().toUpperCase())
        return this.connect()[this._getDBName()]
    }

    static find(query) {
        let db    = this.connect()
        let table = db[this._getDBName()]
        let obj   = null

        if (typeof query === 'string' || typeof query === 'number') {
            obj = table.filter(e => e.id === query)[0]
            console.log("FINDING OBJECT BY ID# " + query + " FROM DB " + this._getDBName().toUpperCase())
        } else if (typeof query === 'object') {
            obj = _.find(table, query)
            console.log("FINDING OBJECT BY QUERY " + JSON.stringify(query) + " FROM DB " + this._getDBName().toUpperCase())
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
        let table = db[this._getDBName()]
        let arr   = _.filter(table, query)

        arr = arr.map(e => _.assign(new this(), e))
        console.log("FINDING ALL OBJECTS WITH QUERY: " + JSON.stringify(query) + " FROM DB " + this._getDBName().toUpperCase())
        return arr
    }

    static destroy(id) {
        let db    = this.connect()
        let table = db[this._getDBName()]
        let obj   = table.filter(e => e.id === id)[0]

        if (obj) {
            db[this._getDBName()] = table.filter(e => e !== obj)
            fs.writeFileSync(dbPath, JSON.stringify(db))
            console.log("DELETING OBJECT " + obj.id + " FROM DB " + this._getDBName().toUpperCase())
            return true
        } else {
            return false
        }
    }

    save() {
        let db    = this.constructor.connect()
        let table = db[this._getDBName()]
        let obj   = table.filter(e => e.id === this.id)[0]

        if (obj) {
            table[table.indexOf(obj)] = this
        } else {
            this.id = tools.generateRandomString(6)
            table.push(this)
        }

        try {
            fs.writeFileSync(dbPath, JSON.stringify(db))
            console.log("SAVING OBJECT " + this.id + " IN DB " + this._getDBName().toUpperCase())
            return this
        } catch (err) {
            return null
        }
    }

    retrieveDBCopy() {
        let db    = this.constructor.connect()
        let table = db[this._getDBName()]
        let obj   = table.filter(e => e.id === this.id)[0]

        if (obj) {
            console.log("FETCHING COPY OF ITEM " + obj.id + " FROM DB " + this._getDBName().toUpperCase())
            return obj
        } else {
            return null
        }
    }

    destroy() {
        let db    = this.constructor.connect()
        let table = db[this._getDBName()]
        let obj   = table.filter(e => e.id === this.id)[0]

        if (obj) {
            db[this._getDBName()] = table.filter(e => e !== obj)
            console.log("DELETING OBJECT " + obj.id + " FROM DB " + this._getDBName().toUpperCase())
            fs.writeFileSync(dbPath, JSON.stringify(db))            
            return true
        } else {
            return false
        }
    }

    // PRIVATE METHODS

    static _getDBName() {
        return this.name.toLowerCase() + "s" + "DB"
    }

    _getDBName() {
        return this.constructor.name.toLowerCase() + "s" + "DB"
    }
}

module.exports = Model