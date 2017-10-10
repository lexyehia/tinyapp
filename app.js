const express       = require('express'),
      app           = express(),
      bodyParser    = require('body-parser'),
      morgan        = require('morgan'),
      cookieParser  = require('cookie-parser')

const PORT = process.env.PORT || 3000

let urlDatabase = {
    "b2xVn2": "http://www.lighthouselabs.ca",
    "9sm5xK": "http://www.google.com"
}

app.use(morgan('dev'))
app.set('view engine', 'ejs')
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: true}))

app.post('/login', (req, res) => {
    console.log(`Logging in ${req.body.username}`)
    res.cookie('username', req.body.username)
    res.redirect('/urls')
})

app.post('/logout', (req, res) => {
    console.log(`Logging out ${req.cookies.username}`)
    res.clearCookie('username')
    res.redirect('/urls')
})

app.get('/register', (req, res) => {
    res.render('users_new', {username: req.cookies.username})
})

app.post('/register', (req, res) => {
    console.log(`Creating new user`)
    urlDatabase[key] = req.body.longURL
    res.redirect('/u/' + key)
})

app.get('/urls/new', (req, res) => {
    res.render('urls_new', {username: req.cookies.username})
})

app.post('/urls/new', (req, res) => {
    const key = generateRandomString()
    console.log(`Creating short url /u/${key} for ${req.body.longURL}`)
    urlDatabase[key] = req.body.longURL
    res.redirect('/u/' + key)
})

app.get('/urls/:id', (req, res) => {
    res.render('urls_show', {shortURL: req.params.id, longURL: urlDatabase[req.params.id], username: req.cookies.username})
})


app.get('/urls', (req, res) => {
    res.render('urls_index', {urls: urlDatabase, username: req.cookies.username})
})

app.post('/urls/:shortURL/delete', (req, res) => {
    delete urlDatabase[req.params.shortURL]

    if (!urlDatabase[req.params.shortURL]) {
        console.log(`${req.params.shortURL} deletion succeeded. Redirecting to index`)
    }

    res.redirect('/urls')
})

app.post('/urls/:id', (req, res) => {
    console.log(`Updating short url /u/${req.params.id} to ${req.body.longURL}`)
    urlDatabase[req.params.id] = req.body.longURL
    res.redirect('/u/' + key)
})

app.get('/u/:shortURL', (req, res) => {
    const longURL = urlDatabase[req.params.shortURL]
    if (longURL) console.log(`Redirecting to ${longURL}`)
    res.redirect(longURL)
})

function generateRandomString() {
    return Math.random().toString(36).substring(2, 8)
}

app.listen(PORT, () => {
    console.log("Server listening on port: " + PORT)
})



