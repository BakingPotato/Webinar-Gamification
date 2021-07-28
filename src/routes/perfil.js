const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();
const dbConnect = require('../Memory')
const { isLoggedIn, isLoggedInAndAdmin } = require('../lib/auth');

//Menu de usuario
router.get('/perfil', isLoggedIn, async (req, res) => {
    if(req.session.usuario.ES_ADMIN == 1){
        res.redirect('/PerfilA')
    }else{
        let seminarios = await getSeminarios(req);
        let seminario = req.session.usuario.EN_SEMINARIO;
        res.render('menu/perfil', {seminarios, seminario});
    }
});

router.get('/perfil/seminario/:id', isLoggedIn, async (req, res) => {
    const { id }  = req.params;
    await dbConnect.prototype.registrarseEnSeminario(req, id);
    req.session.seminario = null;
    req.session.seminario = req.session.seminarios[id];
    req.session.usuario.EN_SEMINARIO = true;
    res.redirect('/seminario/ponentes');
});

router.get('/perfil/registro/:id', isLoggedIn, (req, res) => {
    res.render('menu/registro', {seminarios, seminario});
});

router.post('/perfil/actualizarPerfil', isLoggedIn, async (req, res) => {
    await dbConnect.prototype.actualizarUsuario(req);
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
    let seminario = req.session.usuario.EN_SEMINARIO;
    res.render('menu/perfilA', {seminarios, seminario});
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
    let seminario = req.session.usuario.EN_SEMINARIO;
    res.render('menu/perfilA', {seminarios, seminario});
});

router.get('/PerfilA/usuarios', isLoggedInAndAdmin, async (req, res) => {
    let usuarios = await getUsuarios(req);
    let seminario = req.session.usuario.EN_SEMINARIO;
    res.render('menu/usuarios', {usuarios, seminario});
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

router.get('/PerfilA/seminario/administrador/:id', isLoggedInAndAdmin, async (req, res) => {
    const { id }  = req.params;
    await dbConnect.prototype.registrarseEnSeminario(req, id);
    req.session.seminario = null;
    req.session.seminario = req.session.seminarios[id];
    req.session.usuario.EN_SEMINARIO = true;
    res.redirect('/seminario/ponentes');
});

router.get('/PerfilA/usuarios/otorgarRol/:id', isLoggedInAndAdmin, async (req, res) => {
    const { id }  = req.params;
    if(id == req.session.usuario.CD_USUARIO){
        req.flash('message', 'Lamentablemente, no puedes quitarte el rol a ti mismo.');
        res.redirect('/PerfilA/usuarios');
    }
    await dbConnect.prototype.añadirRoldeAdmin(req);
    req.session.usuarios[id].ES_ADMIN = 1;
    req.flash('success', 'El usuario ha sido bendecido con privilegios de admin')
    res.redirect('/PerfilA/usuarios');
});


router.post('/PerfilA/seminario/invitar', isLoggedInAndAdmin, async (req, res) => {
    const { DS_CORREO, CD_SEMINARIO }  = req.body;
    const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ludonariotfg@gmail.com',
        pass: 'TFGFinal20-21'
    }
    });

    var mensaje = "Hola, este es un correo para inscribirle en el futuro seminario de la URJC. Cree una cuenta aquí o incie sesión si ya tiene una y se le registrara en el seminario"
    var mailOptions = {
        from: 'ludonariotfg@gmail.com',
        to: DS_CORREO,
        subject: mensaje,
        html: '<p>Hola, este es un correo para inscribirle en el futuro seminario de la URJC. Cree una cuenta <a href="http://localhost:9001/inicio/' + CD_SEMINARIO + '">aquí</a> o incie sesión si ya tiene una y se le registrara en el seminario</p>'
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email enviado: ' + info.response);
        }
    });
  
    req.flash('success', 'El mansaje se envio al email seleccionado')
    res.redirect('/PerfilA');
});

router.post('/PerfilA/registrarU', isLoggedInAndAdmin, async (req, res) => {
    await dbConnect.prototype.registrarUsuario(req);
    req.flash('success', 'Su usuario se actualizo correctamente');
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'ludonariotfg@gmail.com',
            pass: 'TFGFinal20-21'
        }
        });
    
        var mensaje = "Hola, le informamos que ha sido registrado en la plataforma de ludonario. Para iniciar sesión introduzca este correo y la constraseña: " + req.body.DS_PASS
        var mailOptions = {
            from: 'ludonariotfg@gmail.com',
            to: req.body.DS_CORREO,
            subject: mensaje
        };
    
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email enviado: ' + info.response);
            }
        });
      
    if(req.session.usuario.ES_ADMIN == 0){
        res.redirect('/perfil');
    }else{
        res.redirect('/PerfilA');
    }
});


async function getSeminarios(req){
    let seminarios = {};
    if(!req.session.seminarios){
        seminarios = await dbConnect.prototype.getSeminariosActivos(req);
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