const tools  = require('../helpers/tools'),
      db     = require('../db/db'),
      bcrypt = require('bcrypt')


module.exports = (app) => {

    /*
    *   GET /register
    *   Open form page to create a new user
    **/
    app.get('/register', (req, res) => {
        res.render('users/new', {userID: null})
    })

    /*
    *   POST /register
    *   Submit registration to create new user, redirect to /urls
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

        const id = tools.generateRandomString(6)

        console.log(`Creating new user with ID# ${id}`)

        db.userDatabase[id] = {
            id:       id,
            email:    req.body.email,
            password: bcrypt.hashSync(req.body.password, 10)
        }

        req.session.user_id = id
        res.redirect('/urls')
    })

    /*
    *   GET /login
    *   Request login page
    **/
    app.get('/login', (req, res) => {
        res.render('users/login', {userID: null})
    })

    /*
    *   POST /login
    *   Create a new user session
    **/
    app.post('/login', (req, res) => {
        let currentUser = null

        if(!req.body.email || !req.body.password) {
            res.status(403).send("Invalid credentials inputted")
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
            res.status(403).send("Invalid credentials inputted")
        }
    })

    /*
    *   DELETE /logout
    *   Delete current user's session
    **/
    app.delete('/logout', (req, res) => {
        console.log(`Logging out ${req.session.user_id}`)
        req.session.user_id = null
        res.redirect('/urls')
    })
}
