const tools  = require('../helpers/tools'),
      db     = require('../db/db'),
      bcrypt = require('bcrypt'),
      User   = require('../db/user')

module.exports = (app) => {

    /*
    *   GET /register
    *   Open form page to create a new user
    **/
    app.get('/register', (req, res) => {
        res.render('users/new')
    })

    /*
    *   POST /register
    *   Submit registration to create new user, redirect to /urls
    **/
    app.post('/register', (req, res) => {

        let user = new User(req.body.email, req.body.password)

        if (user) {
            console.log(`Creating new user with ID# ${user.id}`)            
            req.session.user_id = user.id
            res.redirect('/urls')
        } else {
            res.send("Invalid email or password")
        }
    })

    /*
    *   GET /login
    *   Request login page
    **/
    app.get('/login', (req, res) => {
        res.render('users/login')
    })

    /*
    *   POST /login
    *   Create a new user session
    **/
    app.post('/login', (req, res) => {
        let user = User.verifyPassword(req.body.email, req.body.password)

        if (user) {
            console.log(`Logging in ${user.id}`)        
            req.session.user_id = user.id
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
        if (User.verifySession(req.session)) {
            console.log(`Logging out ${req.session.user_id}`)
            req.session.user_id = null
            res.redirect('/urls')
        } else {
            res.redirecT('/urls')
        }
    })
}
