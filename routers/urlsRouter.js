module.exports = (app) => {

    app.get('/urls/new', (req, res) => {
        if (req.session.user_id) {
            res.render('urls_new', {userID: userDatabase[req.session.user_id]})        
        } else {
            res.redirect('/login')
        }
    })

    app.post('/urls/new', (req, res) => {
        if (req.session.user_id) {
            const key = generateRandomString()
            console.log(`Creating short url /u/${key} for ${req.body.longURL}`)
            urlDatabase[key] = {
                url: req.body.longURL,
                userID: req.session.user_id
            }
            res.redirect('/u/' + key)
        } else {
            res.statusCode = 403
            res.send("Access denied")
        }
    })

    app.get('/urls/:id', (req, res) => {
        if (urlDatabase[req.params.id].userID === req.session.user_id) {
            const varParams = {
                shortURL: req.params.id, 
                longURL: urlDatabase[req.params.id].url, 
                userID: userDatabase[req.session.user_id]
            }
            res.render('urls_show', varParams)
        } else {
            res.statusCode = 403
            res.end("Access denied")
        }
    })


    app.get('/urls', (req, res) => {
        if (!req.session.user_id) {
            res.statusCode = 403
            res.redirect('/login')
        } else {
            res.render('urls_index', {
                urls: findUserURLS(req.session.user_id), 
                userID: userDatabase[req.session.user_id]
            })        
        }

    })

    app.post('/urls/:shortURL/delete', (req, res) => {
        if (urlDatabase[req.params.shortURL].userID === req.session.user_id) {
            delete urlDatabase[req.params.shortURL]

            if (!urlDatabase[req.params.shortURL]) {
                console.log(`${req.params.shortURL} deletion succeeded. Redirecting to index`)
            }

            res.redirect('/urls')
        } else {
            res.statusCode = 403
            res.end("Access denied")
        }
    })

    app.post('/urls/:id', (req, res) => {
        if (urlDatabase[req.params.id].userID === req.session.user_id) {
            console.log(`Updating short url /u/${req.params.id} to ${req.body.longURL}`)
            urlDatabase[req.params.id].url = req.body.longURL
            res.redirect('/u/' + key)
        } else {
            res.statusCode = 403
            res.end("Access denied")
        }    
    })
}
