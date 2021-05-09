const express = require('express');
const router = express.Router();
const dbConnect = require('../Memory')
const { isLoggedIn } = require('../lib/auth');

//Menu de usuario
router.get('/perfil', isLoggedIn, async (req, res) => {
    if(req.session.usuario.ES_ADMIN == 1){
        res.redirect('/PerfilA')
    }else{
        let seminarios = await getSeminarios(req);
        res.render('menu/perfil', {seminarios});
    }
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
    if(req.session.usuario.ES_ADMIN == 0){
        res.redirect('/perfil');
    }else{
        res.redirect('/PerfilA');
    }
});

//Menu de administrador
router.get('/PerfilA', isLoggedIn, async (req, res) => {
    if(req.session.usuario.ES_ADMIN == 0){
        res.redirect('/perfil')
    }
    let seminarios = await getSeminarios(req);
    res.render('menu/perfilA', {seminarios});
});

router.post('/PerfilA/registrarSeminario', isLoggedIn, async (req, res) => {
    const newSeminario = await dbConnect.prototype.registrarSeminario(req);
    if(newSeminario == 10000){ //Si ocurrio un error durante el registro avisamos
        req.flash('message', 'El seminario no pudo registrarse');
        res.redirect('/PerfilA');
    }else{ //Borramos los seminarios para que se vuelva a comprobar los seminarios activos
        req.session.seminarios = null;
        req.flash('success', 'Seminario registrado correctamente');
        res.redirect('/PerfilA');
    }
   
});

async function getSeminarios(req){
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
    return seminarios;
}

module.exports = router;