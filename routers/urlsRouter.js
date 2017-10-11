const tools = require('../helpers/tools'),
         db = require("../db/db"),
         URL = require('../db/url')

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
            let url = new URL(req.session.user_id, req.body.longURL)
            console.log(`Creating short url /u/${url.id} for ${url.url}`)
            res.redirect('/u/' + url.id)
        } else {
            res.status(403).send("Access denied")
        }
    })

    /*
    *   GET /urls/{ID}
    *   Open the Edit form of a particular url
    **/
    app.get('/urls/:id', (req, res) => {
        let url = URL.find(id)
        
        if (req.session.user_id && url.userID === req.session.user_id) {
            res.render('urls/show', {
                shortURL: url.id,
                url:      url,
                userID:   req.session.user_id
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
        let url = URL.find(req.params.id)

        if (url.userID === req.session.user_id) {
            console.log(`Updating short url /u/${url.id} to ${req.body.longURL}`)
            url.url = req.body.longURL
            url.update()

            res.redirect('/u/' + url.id)
        } else {
            res.status(403).send("Access denied")
        }
    })

    /*
    *   DELETE /urls/{ID}
    *   Delete one url
    **/
    app.delete('/urls/:id', (req, res) => {
        let url = URL.find(req.params.id)

        if (url.userID === req.session.user_id && url.destroy()) {
            console.log(`${req.params.id} deletion succeeded. Redirecting to index`)
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
            urls:          tools.findUserURLS(db, req.session.user_id),
            filterUniques: tools.filterUniques,
            userID:        db.userDatabase[req.session.user_id]
        })
    })
}