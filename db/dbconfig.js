const fs   = require('fs'),
      path = require('path')

/**
 * Uncomment whether to use production db.json or 
 * testing db-test.json (with pre-populated data)
 */
const dbSelect = 'db.json'
// const dbSelect = 'db-test.json' 

/**
 * This class is used to initialize the database 
 * and retrieve data from it
 * 
 * @class DBContext
 */
class DBContext {

    constructor() {
        this.dbPath = path.resolve(__dirname, dbSelect)
        this.data = this.data || this._connect()
        return this
    }

    /**
     * If database file exists, this method will read the .json file
     * and parse it into a Javascript object
     * 
     * @returns {object}
     * @memberof DBContext
     */
    _connect() {
        this._createDB()
        return JSON.parse(fs.readFileSync(this.dbPath))
    }

    /**
     * If database .json file does not already exist, this method will create
     * one with the basic structure, creating collections based on the names
     * of files in the "models" subdirectory.
     * 
     * If this method is invoked with {force: true} as options parameter, it
     * will overwrite any existing database file with a fresh one 
     * (WARNING: Data loss).
     * 
     * @param {object} force: {true|false} 
     * @memberof DBContext
     */
    _createDB(options) {
        options = options || {}

        if (fs.existsSync(this.dbPath) && options.force !== true) {
            return
        } else {
            let classes = fs.readdirSync(path.resolve(__dirname, "../models/"))
                .filter(e => !e.includes('model') && !e.includes('.json'))
                .map(e => e.substring(0, e.indexOf('.')))

            let structure = {}
            classes.forEach((e) => structure[e + 's' + 'DB'] = [])

            fs.writeFileSync(this.dbPath, JSON.stringify(structure))
        }
    }
}

module.exports = new DBContext()
