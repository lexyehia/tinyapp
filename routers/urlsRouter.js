const tools = require('../helpers/tools'),
         db = require("../db/db")

module.exports = (app) => {

    /*
    *   GET /urls/new
    *   Open new url form
    **/
    app.get('/urls/new', (req, res) => {
        if (req.session.user_id) {
            res.render('urls/new', {userID: db.userDatabase[req.session.user_id]})
        } else {
            res.redirect('/login')
        }
    })

    /*
    *   POST /urls/new
    *   Submit new url for registration, redirect to created url
    **/
    app.post('/urls/new', (req, res) => {
        if (req.session.user_id) {
            const key = tools.generateRandomString(6)
            console.log(`Creating short url /u/${key} for ${req.body.longURL}`)
            db.urlDatabase[key] = {
                url: tools.verifyHttp(req.body.longURL),
                userID: req.session.user_id,
                redirects: 0,
                uniques: []
            }
            res.redirect('/u/' + key)
        } else {
            res.status(403).send("Access denied")
        }
    })

    /*
    *   GET /urls/{ID}
    *   Open the Edit form of a particular url
    **/
    app.get('/urls/:id', (req, res) => {
        if (req.session.user_id && db.urlDatabase[req.params.id].userID === req.session.user_id) {
            let url = db.urlDatabase[req.params.id]
            res.render('urls/show', {
                shortURL: req.params.id,
                url: url,
                userID: req.session.user_id
            })
        } else {
            res.status(403).send("Access denied")
        }
    })

    /*
    *   PUT /urls/{ID}
    *   Submit the Edit form, and modify existing url entry
    **/
    app.put('/urls/:id', (req, res) => {
        if (db.urlDatabase[req.params.id].userID === req.session.user_id) {
            console.log(`Updating short url /u/${req.params.id} to ${req.body.longURL}`)
            db.urlDatabase[req.params.id].url = req.body.longURL
            res.redirect('/u/' + key)
        } else {
            res.status(403).send("Access denied")
        }
    })

    /*
    *   DELETE /urls/{ID}
    *   Delete one url
    **/
    app.delete('/urls/:id', (req, res) => {
        if (db.urlDatabase[req.params.id].userID === req.session.user_id) {
            delete db.urlDatabase[req.params.id]

            if (!db.urlDatabase[req.params.id]) {
                console.log(`${req.params.id} deletion succeeded. Redirecting to index`)
            }

            res.redirect('/urls')
        } else {
            res.status(403).send("Access denied")
        }
    })

    /*
    *   GET /urls/
    *   List urls index
    **/
    app.get('/urls', (req, res) => {
        tools.authenticateUser(req, res, '/login')

        res.render('urls/index', {
            urls: tools.findUserURLS(db, req.session.user_id),
            filterUniques: tools.filterUniques,
            userID: db.userDatabase[req.session.user_id]
        })
    })
}
