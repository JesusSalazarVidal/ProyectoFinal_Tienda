const express = require('express');
const engine = require('ejs-mate');
const path = require('path');
const morgan = require('morgan');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const multer = require('multer');

const { v4: uuidv4, v4 } = require('uuid'); 
const { format } = require('timeago.js');





//Inicializaciones
const app = express();
require('./database');
require('./passport/local-auth');

// Settings
app.set('views', path.join(__dirname, 'views'))
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.listen(3000);

//Middlewears
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(session({
  secret: 'misesionsecreta',
  resave: false,
  saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  app.locals.signinMessage = req.flash('signinMessage');
  app.locals.signupMessage = req.flash('signupMessage');
  app.locals.user = req.user;
  //console.log(app.locals)
  next();
});

app.use(express.urlencoded({extended: false}));
const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/images/uploads'),
    filename: (req, file, cb, filename) => {
        console.log(file);
        cb(null, v4() + path.extname(file.originalname));
    }
}) 

app.use(express.static(path.join(__dirname, "public")));
app.use(multer({storage}).single('image'));
app.use((req, res, next) => {
  app.locals.format = format;
  next();
});
//Routes
app.use('/', require('./routes/index'));
app.use(require('./routes/images.routes'));

app.use((req, res) => {
  res.render("index");
});

//Incio de servidor 
console.log('SERVIDOR EN PUERTO',3000);