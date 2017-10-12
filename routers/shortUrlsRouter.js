const URL  = require('../db/url')

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
            res.redirect(url.url)
        } else {
            res.redirect('/urls')
        }
    })
}