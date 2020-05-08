// if (process.env.NODE_ENV !== 'production') {
//   require('dotenv').config()
// }

// require('dotenv').config()
const express = require('express');
const bodyParser =require('body-parser');
const expressLayouts = require('express-ejs-layouts');
const cors = require('cors');
const path = require('path');
const mysqlConnection = require('./connection');
const app = express();
const port = process.env.PORT || 3300;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');

require('dotenv').config({ path: path.resolve(__dirname, './.env') })

const indexRouter = require("./routes/index");
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
app.use(bodyParser.json());
app.use(cors());
app.use(expressLayouts);

//serve static files
app.use(express.static(path.join(__dirname, '/assets')));

app.use("/index", indexRouter);
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


app.get('/login', checkNotAuthenticated, function(req, res) {
  res.render('login', { layout: 'layoutAuth' })
});

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))


app.get('/signup', checkNotAuthenticated, function(req, res) {
  res.render('signup.ejs', { layout: 'layoutAuth' })
});

app.post('/signup', checkNotAuthenticated, async function(req, res) {
  try{ 
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const user = { name: req.body.name, password: hashedPassword}
    users.push(user)
    res.redirect('/login', { layout: 'layoutAuth' });
  } catch {
    res.redirect('/signup', { layout: 'layoutAuth' });
  }
})

//, { name: req.user.name }
app.get('/', function (req, res) {
  res.render('homepage.ejs');
})

app.get('/aboutus', function(req, res) {
  res.render('aboutus.ejs');
})

app.get('/termsandcondition', function(req, res) {
  res.render('terms_and_condition.ejs');
})

app.get('/events', function(req,res) {
  res.render('events.ejs');
})

app.get('/postad', checkAuthenticated, async function(req, res) {
  res.render('postad.ejs');
})

app.get('/postad/continuePostAd', checkAuthenticated, async function(req, res) {
  res.render('continuePostAd.ejs');
})

app.get('/adPreview', checkAuthenticated, async function(req, res) {
  res.render('adPreview.ejs');
})

app.get('/selectionPage', function(req, res) {
  res.render('selectionPage.ejs');
})

//Testing JWT

// function authenticateToken (req, res, next ) {
//   const authHeader = req.headers['authorization']
//   const token = authHeader && authHeader.split (' ')[1]
//   if (token == null) return res.sendStatus(401); 
//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, user)  {
//     if(err) return res.sendStatus(403);
//     req.user = user
//     next();
//   })
// }

app.get('/posts', function(req, res) {
  res.json(posts.filter(post => post.username === req.user.name ));
})

//User authentication
// app.get('/users', function(req, res) {
//   res.json(users)
// })

// app.post('/users', async function(req, res) {
//   try{ 
//       const hashedPassword = await bcrypt.hash(req.body.password, 10)
//       const user = { name: req.body.name, password: hashedPassword}
//     users.push(user)
//       res.status(201).send()
//   } catch {
//     res.status(500);
//   }
// })

// app.post('/users/login', async function(req, res) {
//   const user = users.find(user => user.name = req.body.name)
//   if (user == null) {
//     return res.status(400).send("Cannot find user")
//   }
//   try {
//     if (await bcrypt.compare(req.body.password, user.password)){
//       res.send("Success")
//     } else {
//       res.send("Not allowed") 
//     }
//   } catch {
//     res.status(500).send()
//   }
// })

app.delete('/logout', function(req, res) {
  req.logOut()
  res.redirect('/login')
})

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if(req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}

// console.log(process.env['MYSQL_USER']);


app.listen(process.env.PORT || 3300, () => {
  console.log(`Server running at port ${port}`)
})

