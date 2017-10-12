const fs   = require('fs'),
      path = require('path')

class DBContext {
    constructor() {
        this.dbPath = path.resolve(__dirname, 'db.json')

        if (this.data === undefined) {
            this.data = this._connect()
        }

        return this
    }

    _connect() {
        // TODO: Check whether .json file exists, otherwise create it
        this._createDB()
        return JSON.parse(fs.readFileSync(this.dbPath))
    }

    _createDB(options) {
        options = options || {}

        if (fs.existsSync(this.dbPath) && options.force !== true) {
            return
        } else {
            let classes   = fs.readdirSync(path.resolve(__dirname))
                .filter(e => !e.includes('model') && !e.includes('.json'))
                .map(e => e.substring(0, e.indexOf('.')))

            let structure = {}
            classes.forEach((e) => structure[e + 's' + 'DB'] = [])

            fs.writeFileSync(this.dbPath, JSON.stringify(structure))
        }
    }
}

module.exports = new DBContext()