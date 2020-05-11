const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, './.env') })
const express = require('express');
const bodyParser =require('body-parser');
const expressLayouts = require('express-ejs-layouts');
const cors = require('cors');
const mysqlConnection = require('./connection');
const app = express();
const port = process.env.PORT || 3000;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser')

const login = require('./routes/index').login
const isAuthenticated = require('./routes/index').isAuthenticated

const initializePassport = require('./passport-config')
initializePassport(
  passport, 
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)

app.set('view engine', 'ejs');

//template engine
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended: false}))
app.use(bodyParser());
app.use(cookieParser())
app.use(cors());
app.use(expressLayouts);

//serve static files
app.use(express.static(path.join(__dirname, '/assets')));

app.use(express.json()); 
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))


app.get('/login', function(req, res) {
  res.render('login', { layout: 'layoutAuth' })
});

app.post('/login' , (req, res) => {
  const email = req.body.email
  const password = req.body.password
  login({email , password})
  .then(result => {
    res.cookie('token' , result)
    res.redirect('/')
  })
  .catch(e => console.log(e))
})

app.get('/signup', function(req, res) {
  res.render('signup', { layout: 'layoutAuth'})
});

app.post('/signup', (req, res) => {
  const name = req.body.name
  const lastname = req.body.lastname
  const email = req.body.email
  
})

app.get('/', function (req, res) {
  res.render('homepage.ejs');
})

app.get('/aboutus', isAuthenticated, function(req, res) {
  res.render('aboutus.ejs');
})

app.get('/termsandcondition', isAuthenticated, function(req, res) {
  res.render('terms_and_condition.ejs');
})

app.get('/events', function(req,res) {
  res.render('events.ejs');
})

app.get('/postad', function(req, res) {
  res.render('postad.ejs');
})

app.get('/postad/continuePostAd', function(req, res) {
  res.render('continuePostAd.ejs');
})

app.get('/adPreview', function(req, res) {
  res.render('adPreview.ejs');
})

app.get('/selectionPage', function(req, res) {
  res.render('selectionPage.ejs');
})

app.get('/posts', function(req, res) {
  res.json(posts.filter(post => post.username === req.user.name ));
})

app.delete('/logout', function(req, res) {
  req.logOut()
  res.redirect('/login')
})

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running at port ${port}`)
})

