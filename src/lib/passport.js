const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');
const helpers = require('../lib/helpers');

passport.use('local.inicio', new LocalStrategy({ 
    emailField: 'username',
    passwordField: 'pass',
    passReqToCallback: true
}, async (req, username, password, done)=> {
    const request = new pool.Request();
    const result = await request
        .input("DS_CORREO", pool.VarChar(50), username)
        .execute('OBTENER_USUARIO_POR_LOGIN')
    
    if(result.recordset.length > 0) {
        const user = result.recordset[0];
        const validPass = helpers.matchPassword(password, user.DS_PASS);
        if(validPass){
            return done(null, user, req.flash('Bienvenido ' + user.DS_NOMBRE));
        }else{
            done(null, false, req.flash('Contraseña incorrecta'))
        }
    } else {
        return done(null, false, req.flash('No se ha encontrado su dirección de correo'))
    }
}))

passport.use('local.registro', new LocalStrategy({
    emailField: 'username',
    passwordField: 'pass',
    passReqToCallback: true
}, async (req, username, password, done)=> {
    const { name, descripcion } = req.body;

    const newUser = {
        username,
        name,
        descripcion,
        password
    }
    newUser.password = await helpers.encryptPassword(password);

    const request = new pool.Request();
    const result = await request
        .input("DS_CORREO", pool.VarChar(50), newUser.username)
        .input("DS_NOMBRE", pool.VarChar(50), newUser.name)
        .input("DS_DESCRIPCION", pool.VarChar(250), newUser.descripcion)
        .input("DS_PASS", pool.VarChar(50), newUser.password)
        .input("ES_ADMIN", pool.Bit, 0)
        .execute('REGISTRAR_USUARIO')
    newUser.CD_USUARIO = result.returnValue
    return done(null, newUser);
}))

passport.serializeUser((user, done)=>{
    done(null, user.CD_USUARIO);
})

passport.deserializeUser(async(id, done) => {
    const request2 = new pool.Request();
    const result = await request2.input("CD_USUARIO", pool.Int, id).execute('OBTENER_USUARIO_POR_ID');
    done(null, result.recordset[0]);
})