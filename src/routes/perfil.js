const express = require('express');
const router = express.Router();
const dbConnect = require('../Memory')

const passport = require('passport');
const { isLoggedIn } = require('../lib/auth');

router.get('/perfil', isLoggedIn, async (req, res) => {
    const seminarios = await dbConnect.prototype.getSeminariosActivos();
    res.render('menu/perfil', {seminarios});
});

router.get('/perfil/registro/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params.id;
    res.render('menu/registro', {id});
});

router.post('/perfil/registro/:id', isLoggedIn, async (req, res) => {
    const seminarios = await dbConnect.prototype.getSeminariosActivos();
    req.redirect('seminario/'+ id);
});

module.exports = router;