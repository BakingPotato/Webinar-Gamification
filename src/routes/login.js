const express = require('express');
const router = express.Router();

const passport = require('passport');
const { isLoggedIn } = require('../lib/auth');

router.get('/registro/:id', (req, res)=> {
    const {id} = req.params;
    res.render('login/singup', {id})
});

router.get('/registro', (req, res)=> {
    res.render('login/singup')
});

router.post('/registro', passport.authenticate('local.registro', {
        successRedirect: '/perfil',
        failureRedirect: '/registro',
        failureFlash: true
    }));

router.get('/inicio', (req, res) => {
    res.render('login/singin')
});

router.post('/registro/:id',  passport.authenticate('local.registro_alter', {
            successRedirect: '/perfil',
            failureRedirect: '/registro',
            failureFlash: true
        }
    ));

router.get('/inicio', (req, res) => {
    res.render('login/singin')
});

router.post('/inicio', (req, res, next) => {
        passport.authenticate('local.inicio', {
            successRedirect: '/perfil',
            failureRedirect: '/inicio',
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