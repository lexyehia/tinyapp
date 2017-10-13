const express       = require('express'),
      app           = express(),
      bodyParser    = require('body-parser'),
      morgan        = require('morgan'),
      fs            = require('fs'),
      methodOver    = require('method-override'),
      cookieSession = require('cookie-session')

// Set port, either from environmental variable or default to 8080
const PORT = process.env.PORT || 8080

// Set middle-ware
app.use(morgan('dev'))
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(methodOver('_method'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieSession({
    name: 'tinyapp',
    keys: ['Key1', 'Key2']
}))

// Read the Routers subdirectory and require each file there
// then pass the app object to those routers, for each resource type
fs.readdirSync('./routers/').forEach(file => {
    const name = file.substr(0, file.indexOf('.'))
    require('./routers/' + name)(app)
})

// Any invalid urls will be redirected to custom 404 page
app.use((req, res) => {
    res.status(404).render('404')
})

// Start server
app.listen(PORT, () => {
    console.log("Server listening on port: " + PORT)
})
