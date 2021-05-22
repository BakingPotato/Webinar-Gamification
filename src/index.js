const express = require('express');
const morgan = require('morgan');
const path = require("path");
const handlebars = require('express-handlebars');
const validator = require('express-validator');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const mssql = require('mssql');

process.env["NODE_CONFIG_DIR"] = path.join(__dirname, "configuration");

//Importes globales
const config = require('config');

//Inicializamos express
const app = express();
require('./lib/passport');

const pool = mssql.connect(config.db); //Crea una conexion a una base de datos

app.set('port', procces.env.PORT || config.port)
app.set('views', path.join(__dirname, "views"))
app.engine('.hbs', handlebars({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), "layouts"),
    partialsDir: path.join(app.get('views'), "partials"),
    helpers: require('./lib/handlebars'),
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

const options = {
    connection: mssql.connect(config.db),
    ttl: 3600,
    reapInterval: 3600,
    reapCallback: function() {console.log('expired sessions were removed');}
};

app.use(session({
    secret: 'supersecret',
    resave: false,
    saveUninitialized: false
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
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    app.locals.seminariosAct = req.seminariosAct;
    next();  
})

// Rutas
app.use(require('./routes'));
app.use(require('./routes/login'));
app.use(require('./routes/perfil'));
app.use( require('./routes/seminario'));

// Codigo Publico
app.use(express.static(path.join(__dirname, 'public')));

// Inicializacion
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'))
})