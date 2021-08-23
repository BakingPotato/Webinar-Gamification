const express = require('express');
const router = express.Router();

const passport = require('passport');
const { isLoggedIn, isAlreadyLogged} = require('../lib/auth');

router.get('/registro/:id', (req, res)=> {
    const {id} = req.params;
    res.render('login/singup', {id})
});

router.get('/registro', (req, res)=> {
    res.render('login/singup')
});

router.post('/registro', isAlreadyLogged, passport.authenticate('local.registro', {
        successRedirect: '/perfil',
        failureRedirect: '/registro',
        failureFlash: true
    }));


router.post('/registro/:id', isAlreadyLogged,  passport.authenticate('local.registro_alter', {
            successRedirect: '/perfil',
            failureRedirect: '/registro',
            failureFlash: true
        }
    ));

router.get('/inicio/:id', isAlreadyLogged, (req, res) => {
    const {id} = req.params;
    res.render('login/singin', {id})});
    

router.get('/inicio', isAlreadyLogged, (req, res) => {
    res.render('login/singin')
});

router.post('/inicio', (req, res, next) => {
        passport.authenticate('local.inicio', {
            successRedirect: '/perfil',
            failureRedirect: '/inicio',
            failureFlash: true
        })(req, res, next);
});

router.post('/inicio/:id', (req, res, next) => {
    passport.authenticate('local.inicio_alter', {
        successRedirect: '/perfil',
        failureRedirect: '/inicio/' + req.params.id,
        failureFlash: true
    })(req, res, next);
});

router.get('/salir', isLoggedIn, (req, res) => {
    req.session.seminario = null;
    req.session.seminarios = null;
    req.session.usuario = null;
    req.session.usuarios = null;
    req.logOut();
    res.redirect('inicio');
})

module.exports = router;