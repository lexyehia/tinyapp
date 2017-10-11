const tools  = require('../helpers/tools'),
      db     = require('../db/db'),
      bcrypt = require('bcrypt')


module.exports = (app) => {

    /*
    *   GET /urls/{ID}
    *   Open the Edit form of a particular url
    **/
    app.get('/register', (req, res) => {
        res.render('users/new', {userID: db.userDatabase[req.session.user_id]})
    })

    /*
    *   GET /urls/{ID}
    *   Open the Edit form of a particular url
    **/
    app.post('/register', (req, res) => {
        if (!req.body.email || !req.body.password) {
            res.statusCode = 400
            res.end("You left one or both fields empty!")
            return
        }

        for (let user in db.userDatabase) {
            if (db.userDatabase[user].email === req.body.email) {
                res.statusCode = 400
                res.end("Email already taken.")
                return
            }
        }

        const id = tools.generateRandomString()

        console.log(`Creating new user with ID# ${id}`)

        db.userDatabase[id] = {
            id: id,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 10)
        }

        req.session.user_id = id
        res.redirect('/urls')
    })

    /*
    *   GET /urls/{ID}
    *   Open the Edit form of a particular url
    **/
    app.get('/login', (req, res) => {
        res.render('users/login', {userID: db.userDatabase[req.session.user_id]})
    })

    /*
    *   GET /urls/{ID}
    *   Open the Edit form of a particular url
    **/
    app.post('/login', (req, res) => {
        let currentUser = null

        if(!req.body.email || !req.body.password) {
            res.statusCode = 403
            res.send("Invalid credentials inputted")
        }

        for (let key in db.userDatabase) {
            if (db.userDatabase[key].email === req.body.email &&
                bcrypt.compareSync(req.body.password, db.userDatabase[key].password)) {
                currentUser = db.userDatabase[key]
                break
            }
        }

        if (currentUser) {
            console.log(`Logging in ${currentUser.id}`)        
            req.session.user_id = currentUser.id
            res.redirect('/urls')            
        } else {
            console.log("User not found!")
            res.statusCode = 403
            res.send("Invalid credentials inputted")
        }
    })

    /*
    *   GET /urls/{ID}
    *   Open the Edit form of a particular url
    **/
    app.delete('/logout', (req, res) => {
        console.log(`Logging out ${req.session.user_id}`)
        req.session = null
        res.redirect('/urls')
    })
}
