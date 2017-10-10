const express       = require('express'),
      app           = express(),
      bodyParser    = require('body-parser'),
      morgan        = require('morgan'),
      cookieParser  = require('cookie-parser')

const PORT = process.env.PORT || 3000

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
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: true}))


// USER ENDPOINTS 

app.get('/login', (req, res) => {
    res.render('users_login')
})

app.post('/login', (req, res) => {
    let currentUser = null

    if(!req.body.email || !req.body.password) {
        res.statusCode = 403
        res.send("Invalid credentials inputted")
    }

    for (let key in userDatabase) {
        if (userDatabase[key].email === req.body.email && userDatabase[key].password === req.body.password) {
            currentUser = userDatabase[key]
            break
        }
    }

    if (currentUser) {
        console.log(`Logging in ${currentUser.id}`)        
        res.cookie('user_id', currentUser.id)
        res.redirect('/urls')            
    } else {
        console.log("User not found!")
        res.statusCode = 403
        res.send("Invalid credentials inputted")
    }
})

app.post('/logout', (req, res) => {
    console.log(`Logging out ${req.cookies.user_id}`)
    res.clearCookie('user_id')
    res.redirect('/urls')
})

app.get('/register', (req, res) => {
    res.render('users_new', {userID: userDatabase[req.cookies.user_id]})
})

app.post('/register', (req, res) => {
    if (!req.body.email || !req.body.password) {
        res.statusCode = 400
        res.end("You left one or both fields empty!")
        return
    } 

    for (let user in userDatabase) {
        if (userDatabase[user].email === req.body.email) {
            res.statusCode = 400
            res.end("Email already taken.") 
            return
        }
    }

    const id = generateRandomString() 

    console.log(`Creating new user with ID# ${id}`)

    userDatabase[id] = {
        id: id,
        email: req.body.email,
        password: req.body.password
    }

    res.cookie('user_id', id)
    res.redirect('/urls')
})

// URL ENDPOINTS 

app.get('/urls/new', (req, res) => {
    if (req.cookies.user_id) {
        res.render('urls_new', {userID: userDatabase[req.cookies.user_id]})        
    } else {
        res.redirect('/login')
    }
})

app.post('/urls/new', (req, res) => {
    const key = generateRandomString()
    console.log(`Creating short url /u/${key} for ${req.body.longURL}`)
    urlDatabase[key].url = req.body.longURL
    res.redirect('/u/' + key)
})

app.get('/urls/:id', (req, res) => {
    if (urlDatabase[req.params.id].userID === req.cookies.user_id) {
        const varParams = {
            shortURL: req.params.id, 
            longURL: urlDatabase[req.params.id].url, 
            userID: userDatabase[req.cookies.user_id]
        }
        res.render('urls_show', varParams)
    } else {
        res.statusCode = 403
        res.end("Access denied")
    }
})


app.get('/urls', (req, res) => {
    if (!req.cookies.user_id) {
        res.statusCode = 403
        res.redirect('/login')
    } else {
        res.render('urls_index', {
            urls: findUserURLS(req.cookies.user_id), 
            userID: userDatabase[req.cookies.user_id]
        })        
    }

})

app.post('/urls/:shortURL/delete', (req, res) => {
    if (urlDatabase[req.params.shortURL].userID === req.cookies.user_id) {
        delete urlDatabase[req.params.shortURL]

        if (!urlDatabase[req.params.shortURL]) {
            console.log(`${req.params.shortURL} deletion succeeded. Redirecting to index`)
        }

        res.redirect('/urls')
    } else {
        res.statusCode = 403
        res.end("Access denied")
    }
})

app.post('/urls/:id', (req, res) => {
    if (urlDatabase[req.params.id].userID === req.cookies.user_id) {
        console.log(`Updating short url /u/${req.params.id} to ${req.body.longURL}`)
        urlDatabase[req.params.id].url = req.body.longURL
        res.redirect('/u/' + key)
    } else {
        res.statusCode = 403
        res.end("Access denied")
    }    
})

// SHORT URL ENDPOINT

app.get('/u/:shortURL', (req, res) => {
    const longURL = urlDatabase[req.params.shortURL].url
    if (longURL) console.log(`Redirecting to ${longURL}`)
    res.redirect(longURL)
})

// HELPER FUNCTIONS 

function generateRandomString() {
    return Math.random().toString(36).substring(2, 8)
}
function findUserURLS(userId) {
    let userURL = {}
    
    for (let url in urlDatabase) {
        if (urlDatabase[url].userID === userId) {
            userURL[url] = urlDatabase[url]
        }
    }

    return userURL
}

// SERVER START

app.listen(PORT, () => {
    console.log("Server listening on port: " + PORT)
})



