const express = require('express');
const router = express.Router();

const passport = require('passport');
const { isLoggedIn } = require('../lib/auth');

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

router.post('/inicio', (req, res, next) => {
        passport.authenticate('local.inicio', {
            successRedirect: '/perfil',
            failureRedirect: '/inicio',
            failureFlash: true
        })(req, res, next);
});

router.get('/salir', isLoggedIn, (req, res) => {
    req.logOut();
    req.redirect('inicio');
})

module.exports = router;