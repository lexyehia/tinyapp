const express       = require('express'),
      app           = express(),
      bodyParser    = require('body-parser'),
      morgan        = require('morgan'),
      cookieSession = require('cookie-session'),
      bcrypt        = require('bcrypt'),
      urlsRouter    = require('./routers/urlsRouter'),
      usersRouter   = require('./routers/usersRouter')

const PORT = process.env.PORT || 8080

let urlDatabase = {
    "b2xVn2": {
        url: "http://www.lighthouselabs.ca",
        userID: "342242"
    },
    "9sm5xK": {
        url: "http://www.google.com",
        userID: "342242"        
    }
}

let userDatabase = {
    "342242": {
        id: "342242",
        email: "bob@doyle.com",
        password: "blabla"
    }
}

app.use(morgan('dev'))
app.set('view engine', 'ejs')

app.use(cookieSession({
    name: 'tinyapp',
    keys: ['Key1', 'Key2'],
    maxAge: 24 * 60 * 60 * 1000 
}))

app.use(bodyParser.urlencoded({extended: true}))


// Read the Routers subdirectory and require each file there
// then pass the app object to them, for each resource type

fs.readdirSync('./routers/').forEach(file => {
    const name = file.substr(0, file.indexOf('.'))
    require('./' + name)(app)
})

// The uri endpoint for shortened urls

app.get('/u/:shortURL', (req, res) => {
    const longURL = urlDatabase[req.params.shortURL].url
    if (longURL) console.log(`Redirecting to ${longURL}`)
    res.redirect(longURL)
})

// HELPER FUNCTIONS 


// SERVER START

app.listen(PORT, () => {
    console.log("Server listening on port: " + PORT)
})



