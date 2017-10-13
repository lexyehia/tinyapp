const User   = require('../models/user')

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
        const user = User.create(req.body.email, req.body.password)

        if (user) {
            console.log(`Creating new user with ID# ${user.id}`)            
            req.session.user_id = user.id
            res.redirect('/urls')
        } else {
            res.render("users/new", {alert: "Invalid email or password"})
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
        const user = User.verifyPassword(req.body.email, req.body.password)

        if (user) {
            console.log(`Logging in ${user.id}`)        
            req.session.user_id = user.id
            res.redirect('/urls')            
        } else {
            console.log("User not found!")
            //res.status(403).send("Invalid credentials inputted")
            res.status(403).render('users/login', {alert: "Invalid email or password"})
        }
    })

    /*
    *   DELETE /logout
    *   Delete current user's session
    **/
    app.delete('/logout', (req, res) => {
        const user = User.verifySession(req.session)

        if (user) {
            console.log(`Logging out ${user.id}`)
            req.session.user_id = null
        }

        res.render('users/login', {alert: "Logged out successfully. Please log back in."})
    })
}
