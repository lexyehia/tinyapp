module.exports = (app) => {

    
    app.get('/login', (req, res) => {
        res.render('users_login')
    })

    app.post('/login', (req, res) => {
        let currentUser = null

        if(!req.body.email || !req.body.password) {
            res.statusCode = 403
            res.send("Invalid credentials inputted")
        }

        for (let key in userDatabase) {
            if (userDatabase[key].email === req.body.email && bcrypt.compareSync(req.body.password, userDatabase[key].password)) {
                currentUser = userDatabase[key]
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

    app.post('/logout', (req, res) => {
        console.log(`Logging out ${req.session.user_id}`)
        req.session = null
        res.redirect('/urls')
    })

    app.get('/register', (req, res) => {
        res.render('users_new', {userID: userDatabase[req.session.user_id]})
    })

    app.post('/register', (req, res) => {
        if (!req.body.email || !req.body.password) {
            res.statusCode = 400
            res.end("You left one or both fields empty!")
            return
        } 

        for (let user in userDatabase) {
            if (userDatabase[user].email === req.body.email) {
                res.statusCode = 400
                res.end("Email already taken.") 
                return
            }
        }

        const id = generateRandomString() 

        console.log(`Creating new user with ID# ${id}`)

        userDatabase[id] = {
            id: id,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 10)
        }

        req.session.user_id = id
        res.redirect('/urls')
    })
}
