const URL  = require('../models/url'),
      User = require('../models/user')

module.exports = (app) => {

    /*
    *   GET /u/{ID}
    *   Redirect to long URL
    **/
    app.get('/u/:id', (req, res) => {
        let url = URL.find(req.params.id)

        if (url) {
            url.trackVisit(req.session)
            console.log(`Redirecting to ${url.url}`)
            res.redirect(301, url.url)
        } else {
            res.status(404).render('404', {message: 'That short URL does not exist!'})
        }
    })

    /*
    *   GET /
    *   Redirects to /urls (index)
    **/
    app.get('/', (req, res) => {
        const user = User.verifySession(req.session)

        if (user) {
            res.redirect('/urls')            
        } else {
            res.redirect('/login')
        }
    })
}
