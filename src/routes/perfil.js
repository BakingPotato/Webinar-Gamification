const express = require('express');
const router = express.Router();
const dbConnect = require('../Memory')
const { isLoggedIn, isLoggedInAndAdmin } = require('../lib/auth');

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
        req.session.seminario = req.session.seminarios[id];
        res.redirect('/seminario');
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

router.get('/PerfilA', isLoggedInAndAdmin, async (req, res) => {
    let seminarios = await getSeminarios(req);
    res.render('menu/perfilA', {seminarios});
});

router.get('/PerfilA/usuarios', isLoggedInAndAdmin, async (req, res) => {
    let usuarios = await getUsuarios(req);
    res.render('menu/usuarios', {usuarios});
});

router.get('/PerfilA/usuarios/actualizar', isLoggedInAndAdmin, async (req, res) => {
    req.session.usuarios = null; //Reiniciamos la lista local de usuarios para volver a llenarla con lo que haya en la base de datos
    res.redirect('/PerfilA/usuarios')
});

router.get('/PerfilA/usuarios/quitarRol/:id', isLoggedInAndAdmin, async (req, res) => {
    const { id }  = req.params;
    if(id == req.session.usuario.CD_USUARIO){
        req.flash('message', 'Lamentablemente, no puedes quitarte el rol a ti mismo.');
        res.redirect('/PerfilA/usuarios');
    }
    await dbConnect.prototype.quitarRoldeAdmin(id);
    req.session.usuarios[id].ES_ADMIN = 0;
    req.flash('success', 'El usuario ha sido despojado de sus privilegios de admin')
    res.redirect('/PerfilA/usuarios');
});

router.get('/PerfilA/usuarios/otorgarRol/:id', isLoggedInAndAdmin, async (req, res) => {
    const { id }  = req.params;
    if(id == req.session.usuario.CD_USUARIO){
        req.flash('message', 'Lamentablemente, no puedes quitarte el rol a ti mismo.');
        res.redirect('/PerfilA/usuarios');
    }
    await dbConnect.prototype.añadirRoldeAdmin(id);
    req.session.usuarios[id].ES_ADMIN = 1;
    req.flash('success', 'El usuario ha sido bendecido con privilegios de admin')
    res.redirect('/PerfilA/usuarios');
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

async function getUsuarios(req){
    let usuarios = {};
    if(!req.session.usuarios){
        usuarios = await dbConnect.prototype.getUsuarios();
        req.session.usuarios = {};
        for(let i in usuarios){
            req.session.usuarios[usuarios[i].CD_USUARIO] = usuarios[i];
        }
    }
    else{
        usuarios = req.session.usuarios;
    }
    return usuarios;
}

module.exports = router;