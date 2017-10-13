const URL  = require('../models/url'),
      User = require('../models/user')

module.exports = (app) => {

    /*
    *   GET /urls/new
    *   Open new url form
    **/
    app.get('/urls/new', (req, res) => {
        const user = User.verifySession(req.session)

        if (user) {
            res.render('urls/new', {user: user})
        } else {
            res.redirect('/login')
        }
    })

    /*
    *   POST /urls/new
    *   Submit new url for registration, redirect to created url
    **/
    app.post('/urls/new', (req, res) => {
        const user = User.verifySession(req.session)

        if (user) {
            let url = URL.create(user.id, req.body.longURL)
            console.log(`Creating short url /u/${url.id} for ${url.url}`)
            res.redirect('/u/' + url.id)
        } else {
            res.status(403).render('urls/new', {alert: 'Access denied'})
        }
    })

    /*
    *   GET /urls/{ID}
    *   Open the Edit form of a particular url
    **/
    app.get('/urls/:id', (req, res) => {
        const url  = URL.find(req.params.id),
              user = User.verifySession(req.session)
        
        if (user && url.userID === user.id) {
            res.render('urls/show', {url : url, user: user})
        } else {
            res.status(403).render('/urls', {alert: 'Access denied'})
        }
    })

    /*
    *   PUT /urls/{ID}
    *   Submit the Edit form, and modify existing url entry
    **/
    app.put('/urls/:id', (req, res) => {
        let url  = URL.find(req.params.id),
            user = User.verifySession(req.session)

        if (user && user.id === url.userID) {
            console.log(`Updating short url /u/${url.id} 
                         to ${req.body.longURL}`)
            url.url = req.body.longURL
            url.save()
            res.redirect('/u/' + url.id)
        } else {
            res.status(403).render('urls/show', {alert: 'Access denied', url: url,
            user: user})
        }
    })

    /*
    *   DELETE /urls/{ID}
    *   Delete one url
    **/
    app.delete('/urls/:id', (req, res) => {
        let url  = URL.find(req.params.id),
            user = User.verifySession(req.session)

        if (user && url.userID === user.id) {
            url.destroy()
            console.log(`${req.params.id} deletion succeeded. 
                         Redirecting to index`)
            res.redirect('/urls')
        } else {
            res.status(403).send('Access denied')
        }
    })

    /*
    *   GET /urls/
    *   List urls index
    **/
    app.get('/urls', (req, res) => {
        let user = User.verifySession(req.session)

        if (user) {
            let urls = user.urls()
            res.render('urls/index', { user: user, urls: urls })
        } else {
            res.status(403).render('users/login', {alert: 'Please log in first or register a new account!'})
        }
    })
}
