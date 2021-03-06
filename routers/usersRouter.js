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

        // Compare Password and Verify Password first
        if (req.body.password !== req.body.vpassword) {
            res.render('users/new', {
                email: req.body.email,                
                alert: 'Password and verification did not match'
            })
            return
        }

        const user = User.create(req.body.email, req.body.password)

        if (user) {
            console.log(`Creating new user with ID# ${user.id}`)            
            req.session.user_id = user.id
            res.redirect('/urls')
        } else {
            res.render('users/new', {alert: 'Invalid email or password'})
        }
    })

        /*
    *   GET /users/{ID}
    *   Open the Edit form of a particular user
    **/
    app.get('/users/:id', (req, res) => {
        let user   = User.verifySession(req.session),
            target = User.find(req.params.id) 
        
        if (user && target && user.id === target.id) {
            res.render('users/show', {user: target})
        } else {
            res.status(403).render('404', {message: 'Access denied'})
        }
    })

    /*
    *   PUT /users/{ID}
    *   Submit the Edit form, and modify existing url entry
    **/
    app.put('/users/:id', (req, res) => {
        let user   = User.verifySession(req.session),
            target = User.find(req.params.id)

        if (user && target && user.id === target.id) {
            target.email    = req.body.email 
            target.password = req.body.password || target.password
            console.log(`Updating user ID ${target.id}`)            
            target.update()
            res.render('users/show', {
                alert: 'Profile updated', 
                style: 'success', 
                user: target
            })
        } else {
            res.status(403).render('404', {message: 'Access denied'})
        }
    })

    /*
    *   DELETE /urls/{ID}
    *   Delete one url
    **/
    app.delete('/users/:id', (req, res) => {
        let user   = User.verifySession(req.session),
            target = User.find(req.params.id); 

        if (user && target && user.id === target.id) {
            target.destroy()
            req.session.user_id = null
            console.log(`User ID# ${target.id} deleted successfully. Redirecting to index`)
            res.redirect('/login')
        } else {
            res.status(403).render('404', {message: 'Access denied'})
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
            console.log('User not found!')
            res.status(403).render('users/login', {alert: 'Invalid email or password'})
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

        res.render('users/login', {
            alert: 'Logged out successfully. Please log back in.',
            style: 'info'
        })
    })
}
