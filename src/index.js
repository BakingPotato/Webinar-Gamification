const express = require('express');
const morgan = require('morgan');
const path = require("path");
const handlebars = require('express-handlebars');
const validator = require('express-validator');
const bodyParser = require('body-parser');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

process.env["NODE_CONFIG_DIR"] = path.join(__dirname, "configuration");

//Importes globales
const config = require('config');

//Inicializamos express
const app = express();
require('./lib/passport');

app.set('port', config.port)
app.set('views', path.join(__dirname, "views"))
app.engine('.hbs', handlebars({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), "layouts"),
    partialsDir: path.join(app.get('views'), "partials"),
    helpers: require('./lib/handlebars'),
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

app.use(session({
    secret: 'faztmysqlnodess',
    resave: false,
    saveUninitialized: false
    //store: new MySQLStore(config.sqlStore)
}))
app.use(flash());

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(express.urlencoded({extended: false})); //Para aceptar datos de usuarios enviados desde formularios
app.use(express.json()); //Para enviar y recibir JSON (A LO MEJOR SE PUEDE BORRAR)
app.use(passport.initialize());
app.use(passport.session());
//app.use(validator);

//Variables Globales
app.use((req, res, next) => {
    app.locals.success = req.flash('success')
    app.locals.success = req.flash('message');
    app.locals.user = req.user;
    next();  
})

// Rutas
app.use(require('./routes'));
app.use(require('./routes/login'));
app.use(require('./routes/menuUser'));
app.use( require('./routes/menuAdmin'));

// Codigo Publico
app.use(express.static(path.join(__dirname, 'public')));

// Inicializacion
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'))
})