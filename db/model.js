const fs = require('fs');
const _ = require('lodash');
const tools = require('../helpers/tools');
const DBContext = require('./dbconfig');
const DB = DBContext.data;

class Model {

    // TODO: Future use
    /**
     * Fetch an array of all documents in a particular collection
     * 
     * @static
     * @returns {Array}
     * @memberof Model
     */
    static all() {
        console.log("FETCHING ALL OBJECTS FROM DB " + this._getDBName().toUpperCase())
        return DB[this._getDBName()]
    }

    /**
     * Look up a document in the .json file whose properties match the query, 
     * and retrieve first found
     * 
     * @static
     * @param {string|number|object} query 
     * @returns {Model} child instance or null
     * @memberof Model
     */
    static find(query) {
        //db   = db || new DBContext()
        let table = DB[this._getDBName()]
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

    /**
     * Look up all documents in .json file whose properties match the query
     * and retrieve an array of all matched documents
     * 
     * @static
     * @param {any} query 
     * @returns {Array}
     * @memberof Model
     */
    static findAll(query) {
        //this.db   = this.db || new DBContext()
        let table = DB[this._getDBName()]
        let arr   = _.filter(table, query)

        arr = arr.map(e => _.assign(new this(), e))
        console.log("FINDING ALL OBJECTS WITH QUERY: " + JSON.stringify(query) + " FROM DB " + this._getDBName().toUpperCase())
        return arr
    }

    /**
     * Delete a particular instance matching the provided id parameter
     * from the .json file, returns true if successful
     * 
     * @static
     * @param {any} id 
     * @returns {boolean}
     * @memberof Model
     */
    static destroy(id) {
        //this.db   = this.db || new DBContext()
        let table = DB[this._getDBName()]
        let obj   = table.filter(e => e.id === id)[0]

        if (obj) {
            DB[this._getDBName()] = table.filter(e => e !== obj)
            fs.writeFileSync(DBContext.dbPath, JSON.stringify(DB))
            console.log("DELETING OBJECT " + obj.id + " FROM DB " + this._getDBName().toUpperCase())
            return true
        } else {
            return false
        }
    }

    /**
     * Persist all changes in caller object to .json file. First checks whether analogous
     * document in file already exists, and updates its properties, otherwise creates a new
     * document. Returns the saved object if successful.
     * 
     * @returns {Model}
     * @memberof Model
     */
    save() {
        //this.db   = this.db || new DBContext()
        let table = DB[this._getDBName()]
        let obj   = table.filter(e => e.id === this.id)[0]

        if (obj) {
            table[table.indexOf(obj)] = this
        } else {
            this.id = tools.generateRandomString(6)
            table.push(this)
        }

        try {
            fs.writeFileSync(DBContext.dbPath, JSON.stringify(DB))
            console.log("SAVING OBJECT " + this.id + " IN DB " + this._getDBName().toUpperCase())
            return this
        } catch (err) {
            return null
        }
    }

    /**
     * Gets the properties of the document in the .json file that matches the same id
     * as the caller object (i.e. for comparison purposes)
     * 
     * @returns {object}
     * @memberof Model
     */
    retrieveDBCopy() {
       // this.db   = this.db || new DBContext()
        let table = DB[this._getDBName()]
        let obj   = table.filter(e => e.id === this.id)[0]

        if (obj) {
            console.log("FETCHING COPY OF ITEM " + obj.id + " FROM DB " + this._getDBName().toUpperCase())
            return obj
        } else {
            return null
        }
    }

    /**
     * Deletes the caller object from the .json file, returns true if successful
     * 
     * @returns {boolean}
     * @memberof Model
     */
    destroy() {
       // this.db   = this.db || new DBContext()
        let table = DB[this._getDBName()]
        let obj   = table.filter(e => e.id === this.id)[0]

        if (obj) {
            DB[this._getDBName()] = table.filter(e => e !== obj)
            console.log("DELETING OBJECT " + obj.id + " FROM DB " + this._getDBName().toUpperCase())
            fs.writeFileSync(DBContext.dbPath, JSON.stringify(DB))
            return true
        } else {
            return false
        }
    }

    // PRIVATE METHODS

    /**
     * Provides the equivalent collection name of a particular Class 
     * 
     * @static
     * @returns {string}
     * @memberof Model
     */
    static _getDBName() {
        return this.name.toLowerCase() + "s" + "DB"
    }

    /**
     * Provides the equivalent collection name of a particular object's Class 
     * 
     * @returns {string}
     * @memberof Model
     */
    _getDBName() {
        return this.constructor.name.toLowerCase() + "s" + "DB"
    }
}

module.exports = Model