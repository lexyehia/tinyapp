const express       = require('express'),
      app           = express(),
      bodyParser    = require('body-parser')

const PORT = process.env.PORT || 8080

app.set('view engine', 'ejs')

app.get('/urls', (req, res) => {
    res.render('urls_index', {urls: urlDatabase})
})

app.listen(PORT, () => {
    console.log("Server listening on port: " + PORT)
})

let urlDatabase = {
    "b2xVn2": "http://www.lighthouselabs.ca",
    "9sm5xK": "http://www.google.com"
}

