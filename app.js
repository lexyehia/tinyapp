const express       = require('express'),
      app           = express(),
      bodyParser    = require('body-parser'),
      morgan        = require('morgan'),
      fs            = require('fs'),
      methodOver    = require('method-override'),
      cookieSession = require('cookie-session'),
      URL           = require('./db/url')
      
// Set port, either from environmental variable or default to 8080

const PORT = process.env.PORT || 8080

// Set middle-ware

app.use(morgan('dev'))
app.set('view engine', 'ejs')
app.use(methodOver('_method'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieSession({
    name: 'tinyapp',
    keys: ['Key1', 'Key2'],
    maxAge: 24 * 60 * 60 * 1000 
}))

// Read the Routers subdirectory and require each file there
// then pass the app object to them, for each resource type

fs.readdirSync('./routers/').forEach(file => {
    const name = file.substr(0, file.indexOf('.'))
    require('./routers/' + name)(app)
})

// The uri endpoint for shortened urls

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

// Start server

app.listen(PORT, () => {
    console.log("Server listening on port: " + PORT)
})
