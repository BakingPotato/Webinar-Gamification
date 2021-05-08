const express = require('express');
const router = express.Router();
const dbConnect = require('../Memory')
const { isLoggedIn } = require('../lib/auth');

router.get('/perfil', isLoggedIn, async (req, res) => {
    let seminarios = {};
    if(!req.session.seminarios){
        seminarios = await dbConnect.prototype.getSeminariosActivos();
        req.session.seminarios = {};
        for(let i in seminarios){
            req.session.seminarios[seminarios[i].CD_SEMINARIO] = seminarios[i];
        }
    }
    else{
        seminarios = req.session.seminarios;
    }
    res.render('menu/perfil', {seminarios});
});

router.get('/perfil/registro/:id', isLoggedIn, (req, res) => {
    const seminario = req.session.seminarios[req.params.id];
    res.render('menu/registro', {seminario});
});

router.post('/perfil/registro/:id', isLoggedIn, async (req, res) => {
    const { id }  = req.params;
    if(req.body.pass == req.session.seminarios[id].DS_PASS){
        await dbConnect.prototype.registrarseEnSeminario(req, id);
        res.redirect('/seminario/'+ id);
    }else{
        req.flash('message', 'Clave incorrecta, pruebe de nuevo');
        res.redirect('/perfil/registro/' + id);
    }
});

router.post('/perfil/actualizarPerfil', isLoggedIn, async (req, res) => {
    const newUser = await dbConnect.prototype.actualizarUsuario(req);
    req.flash('success', 'Su usuario se actualizo correctamente');
    res.redirect('/perfil');});

module.exports = router;