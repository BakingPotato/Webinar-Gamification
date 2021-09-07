const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const dbConnect = require('../Memory')

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
        let user = result.recordset[0];
        user.ESTA_EN_SEMINARIO = 0;
        const validPass = password == user.DS_PASS;//await helpers.matchPassword(password, user.DS_PASS); 
        if(validPass){
            req.session.usuario = user;
            return done(null, user, req.flash('success', 'Bienvenido ' + user.DS_NOMBRE));
        }else{
            done(null, false, req.flash('message', 'Contraseña incorrecta'))
        }
    } else {
        return done(null, false, req.flash('message', 'No se ha encontrado su dirección de correo'))
    }
}))

passport.use('local.inicio_alter', new LocalStrategy({ 
    emailField: 'username',
    passwordField: 'pass',
    passReqToCallback: true
}, async (req, username, password, done)=> {
    const request = new pool.Request();
    const result = await request
        .input("DS_CORREO", pool.VarChar(50), username)
        .execute('OBTENER_USUARIO_POR_LOGIN')
    
    if(result.recordset.length > 0) {
        let user = result.recordset[0];
        user.ESTA_EN_SEMINARIO = 0;
        const validPass = password == user.DS_PASS// await helpers.matchPassword(password, user.DS_PASS);
        if(validPass){
            req.session.usuario = user;
            await dbConnect.prototype.registrarseEnSeminario(username, password, req.params.id);
            return done(null, user, req.flash('success', 'Bienvenido ' + user.DS_NOMBRE));
        }else{
            done(null, false, req.flash('message', 'Contraseña incorrecta'))
        }
    } else {
        return done(null, false, req.flash('message', 'No se ha encontrado su dirección de correo'))
    }
}))

passport.use('local.registro', new LocalStrategy({
    emailField: 'username',
    passwordField: 'pass',
    passReqToCallback: true
}, async (req, username, password, done)=> {
    const { name } = req.body;

    const newUser = {
        "DS_CORREO" : username,
        "DS_NOMBRE": name,
        "DS_PASS" : password,
        "NM_PUNTOS": 0,
        "ES_ADMIN": 0,
        "ESTA_EN_SEMINARIO": 0,
        "DS_TWITTER": ""

    }

   // newUser.DS_PASS = await helpers.encryptPassword(password);
    const request = new pool.Request();
    const result = await request
        .input("DS_CORREO", pool.VarChar(50), newUser.DS_CORREO)
        .input("DS_NOMBRE", pool.VarChar(50), newUser.DS_NOMBRE)
        .input("DS_PASS", pool.VarChar(50), newUser.DS_PASS)
        .input("ES_ADMIN", pool.Bit, 0)
        .execute('REGISTRAR_USUARIO')
    newUser.CD_USUARIO = result.returnValue
    req.session.usuario = newUser;
    return done(null, newUser, req.flash('success', 'Bienvenido ' + newUser.DS_NOMBRE));
}))

passport.use('local.registro_alter', new LocalStrategy({
    emailField: 'username',
    passwordField: 'pass',
    passReqToCallback: true
}, async (req, username, password, done)=> {
    const { name } = req.body;

    const newUser = {
        "DS_CORREO" : username,
        "DS_NOMBRE": name,
        "DS_PASS" : password,
        "NM_PUNTOS": 0,
        "ES_ADMIN": 0,
        "ESTA_EN_SEMINARIO": 0,
        "DS_TWITTER": ""

    }
    //newUser.DS_PASS = await helpers.encryptPassword(password);

    const request = new pool.Request();
    const result = await request
        .input("DS_CORREO", pool.VarChar(50), newUser.DS_CORREO)
        .input("DS_NOMBRE", pool.VarChar(50), newUser.DS_NOMBRE)
        .input("DS_PASS", pool.VarChar(50), newUser.DS_PASS)
        .input("ES_ADMIN", pool.Bit, 0)
        .execute('REGISTRAR_USUARIO')
    newUser.CD_USUARIO = result.returnValue
    req.session.usuario = newUser;
    await dbConnect.prototype.registrarseEnSeminario(username, password, req.params.id);
    return done(null, newUser, req.flash('success', 'Bienvenido ' + newUser.DS_NOMBRE + ', se le registro en el seminario con exito')); 
}))

passport.serializeUser((user, done)=>{
    done(null, user.CD_USUARIO);
})

passport.deserializeUser(async(id, done) => {
    const request2 = new pool.Request();
    const result = await request2.input("CD_USUARIO", pool.Int, id).execute('OBTENER_USUARIO_POR_ID');
    done(null, result.recordset[0]);
})