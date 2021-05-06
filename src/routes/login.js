const express = require('express');
const router = express.Router();
const passport = require('passport');

//Importamos la conexión a la base de datos
const pool = require = ('../database');

router.get('/registro', (req, res)=> {
    res.render('login/singup')
});

router.post('/registro', passport.authenticate('local.registro', {
        successRedirect: '/profile',
        faiulureRedirect: '/registro',
        failureFlash: true
}));

router.get('/inicio', (req, res) => {
    res.render('login/singin')
});

router.post('/inicio', (req, res, next) => {
        passport.authenticate('local.inicio', {
            successRedirect: '/profile',
            faiulureRedirect: '/inicio',
            failureFlash: true
        })(req, res, next);
});

router.get('/profile',  (req, res) => {
    res.send('this is your profile');
});

module.exports = router;