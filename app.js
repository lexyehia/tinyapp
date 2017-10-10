const express       = require('express'),
      app           = express(),
      bodyParser    = require('body-parser'),
      morgan        = require('morgan')

const PORT = process.env.PORT || 3000

let urlDatabase = {
    "b2xVn2": "http://www.lighthouselabs.ca",
    "9sm5xK": "http://www.google.com"
}

app.use(morgan('dev'))
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))

app.get('/urls/new', (req, res) => {
    res.render('urls_new')
})

app.post('/urls/new', (req, res) => {
    urlDatabase[generateRandomString()] = req.body.longURL
    res.send('Ok')
})

app.get('/urls/:id', (req, res) => {
    res.render('urls_show', {shortURL: req.params.id})
})

app.get('/urls', (req, res) => {
    res.render('urls_index', {urls: urlDatabase})
})

function generateRandomString() {
    return Math.random().toString(36).substring(2, 8)
}

app.listen(PORT, () => {
    console.log("Server listening on port: " + PORT)
})



