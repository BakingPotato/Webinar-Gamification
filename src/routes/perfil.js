const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();
const dbConnect = require('../Memory')
const helpers = require('../lib/helpers');
const { isLoggedIn, isLoggedInAndAdmin } = require('../lib/auth');

//Menu de usuario
router.get('/perfil', isLoggedIn, async (req, res) => {
    if(req.session.usuario.ES_ADMIN == 1){
        res.redirect('/PerfilA')
    }else{
        let seminario = req.session.usuario.EN_SEMINARIO;
        res.render('menu/perfil', {seminario});
    }
});

router.get('/perfil/seminarios', isLoggedIn, async (req, res) => {
    let seminarios = await dbConnect.prototype.getSeminariosParticipado(req);
    req.session.seminarios = {};
    for(let i in seminarios){
        req.session.seminarios[seminarios[i].CD_SEMINARIO] = seminarios[i];
    }
    let seminario = req.session.usuario.EN_SEMINARIO;
    let soyAdmin = false;
    res.render('menu/seminarios', {seminarios, seminario, soyAdmin});
});

router.get('/perfil/seminario/:id', isLoggedIn, async (req, res) => {
    const { id }  = req.params;
    req.session.seminario = null;
    req.session.seminario = req.session.seminarios[id];
    req.session.usuario.EN_SEMINARIO = true;
    res.redirect('/seminario/ponentes');
});

router.get('/perfil/registro/:id', isLoggedIn, (req, res) => {
    res.render('menu/registro', {seminarios, seminario});
});

router.post('/perfil/actualizarPerfil', isLoggedIn, async (req, res) => {
    let result = await dbConnect.prototype.actualizarUsuario(req);
    if(result == -2){
        req.flash('success', 'Su usuario se actualizo correctamente pero el correo '+req.body.DS_CORREO+' ya existe');
    }else{
        req.flash('success', 'Su usuario se actualizo correctamente');
    }
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
    let seminario = req.session.usuario.EN_SEMINARIO;
    res.render('menu/perfilA', {seminario});
});

router.post('/PerfilA/registrarSeminario', isLoggedIn, async (req, res) => {
    const newSeminario = await dbConnect.prototype.registrarSeminario(req);
    if(newSeminario == 10000){ //Si ocurrio un error durante el registro avisamos
        req.flash('message', 'El seminario no pudo registrarse');
        res.redirect('/PerfilA/seminarios');
    }else{ //Borramos los seminarios para que se vuelva a comprobar los seminarios activos
        req.session.seminarios = null;
        req.flash('success', 'Seminario registrado correctamente');
        res.redirect('/PerfilA/seminarios');
    }
});

router.get('/PerfilA', isLoggedInAndAdmin, async (req, res) => {
    let seminarios = await getSeminarios();
    let seminario = req.session.usuario.EN_SEMINARIO;
    res.render('menu/perfilA', {seminarios, seminario});
});

router.get('/PerfilA/usuarios', isLoggedInAndAdmin, async (req, res) => {
    let usuarios = await getUsuarios(req);
    let seminarios = await dbConnect.prototype.getSeminariosActuales();
    let seminario = req.session.usuario.EN_SEMINARIO;
    res.render('menu/usuarios', {usuarios, seminario, seminarios});
});

router.post('/PerfilA/usuarios/invitar/:id', isLoggedInAndAdmin, async (req, res) => {
    const { id }  = req.params;
    await dbConnect.prototype.registrarseEnSeminario(req.body.DS_CORREO, id);
    req.flash('success', 'Se registro al usuario en el seminario correctamente')
    res.redirect('/PerfilA/usuarios');
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
    req.session.usuarios = null;
    req.flash('success', 'El usuario ha sido despojado de sus privilegios de admin')
    res.redirect('/PerfilA/usuarios');
});

router.get('/PerfilA/seminarios', isLoggedInAndAdmin, async (req, res) => {
    let seminarios = await dbConnect.prototype.getSeminarios();
    req.session.seminarios = {};
    for(let i in seminarios){
        req.session.seminarios[seminarios[i].CD_SEMINARIO] = seminarios[i];
    }
    let seminario = req.session.usuario.EN_SEMINARIO;
    let soyAdmin = true;
    let mi_id = req.session.usuario.CD_USUARIO;
    res.render('menu/seminarios', { helpers: { ifEquals: function(arg1, arg2, options) {return (arg1 == arg2) ? options.fn(this) : options.inverse(this);} },
     seminarios, seminario, soyAdmin, mi_id});
});

router.post('/PerfilA/actualizarSeminario', isLoggedInAndAdmin, async (req, res) => {
    await dbConnect.prototype.actualizarSeminario(req);
    req.flash('success', 'El seminario se actualizo correctamente');
    res.redirect('/PerfilA/seminarios');
});

router.get('/PerfilA/seminario/administrador/:id', isLoggedInAndAdmin, async (req, res) => {
    const { id }  = req.params;
    await dbConnect.prototype.registrarseEnSeminario(req.session.usuario.DS_CORREO, id);
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
    await dbConnect.prototype.añadirRoldeAdmin(id);
    req.session.usuarios = null;
    req.flash('success', 'El usuario ha sido bendecido con privilegios de admin')
    res.redirect('/PerfilA/usuarios');
});


router.post('/PerfilA/seminario/invitar', isLoggedInAndAdmin, async (req, res) => {
    const { CD_SEMINARIO}  = req.body;

    if( req.body["DS_CORREO[]"][0].length == 1){
        sendEmail(req.body["DS_CORREO[]"], CD_SEMINARIO, req, res);
    }else{
        for(correo of req.body["DS_CORREO[]"]){
            if(correo && correo != ""){
                sendEmail(correo, CD_SEMINARIO, req, res);
            }
        }
    }
});

router.post('/PerfilA/registrarU', isLoggedInAndAdmin, async (req, res) => {
    let desencrypted = req.body.DS_PASS;
    req.body.DS_PASS = await helpers.encryptPassword(req.body.DS_PASS);
    let result = await dbConnect.prototype.comprobarCorreo(req.body.DS_CORREO);

    if(result.recordset.length > 0){
        req.flash('message', 'El correo '+ req.body.DS_CORREO +' ya esta en uso');
        res.redirect('/PerfilA/usuarios');
    }else{
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'ludonariotfg@gmail.com',
                pass: 'TFGFinal20-21'
            }
            });
        
            var mensaje = "Ha sido registrado en la plataforma de interAppctua"
            var mailOptions = {
                from: 'ludonariotfg@gmail.com',
                to: req.body.DS_CORREO,
                subject: mensaje,
                html: '<p>Hola, le informamos que ha sido registrado en la plataforma de interAppctua. Para iniciar sesión introduzca este correo y la constraseña: ' + desencrypted + '</p>'
    
            };
        
            transporter.sendMail(mailOptions, async function(error, info){
                if (error) {
                  console.log(error);
                  req.flash('message', 'Ocurrió un error en el envío, asegurese de que los datos de su correo son correctos y que este tiene activado acceso de aplicaciones poco seguras');
                  res.redirect('/PerfilA/usuarios');
                } else {
                req.flash('success', 'El usuario fue registrado con éxito');
                  console.log('Email enviado: ' + info.response);
                  await dbConnect.prototype.registrarUsuario(req);
                  req.session.usuarios = null;
                  res.redirect('/PerfilA/usuarios');
                }
            });
    }
});


async function sendEmail(correoDestino, seminario, req, res){
    let result = await dbConnect.prototype.comprobarCorreo(correoDestino);

    if(result.recordsets.length > 0){
        await dbConnect.prototype.registrarseEnSeminario(correoDestino, seminario);
        req.flash('success', 'Se registro al usuario en el seminario correctamente')
        res.redirect('/PerfilA/seminarios');
    }else{
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'ludonariotfg@gmail.com',
                pass: 'TFGFinal20-21'
            }
            });
        
            var mensaje = "Incripción en futuro seminario de la URJC."
            var mailOptions = {
                from: 'ludonariotfg@gmail.com',
                to: correoDestino,
                subject: mensaje,
                html: '<p>Hola, este es un correo para inscribirle en el futuro seminario de la URJC. Cree una cuenta <a href="http://localhost:9001/inicio/' + seminario + '">aquí</a> o incie sesión si ya tiene una y se le registrara en el seminario</p>'
            };
        
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                    req.flash('message', 'Ocurrió un error en el envío, asegurese de que los datos de su correo son correctos y que este tiene activado acceso de aplicaciones poco seguras');
                    res.redirect('/PerfilA/seminarios');
                } else {
                    console.log('Email enviado: ' + info.response);
                    req.flash('success', 'La invitación se envio con éxito al correo o correos seleccionado')
                    res.redirect('/PerfilA/seminarios');
                }
            });
    }
}

async function getUsuarios(req){
    let usuarios = {};
    if(!req.session.usuarios){
        usuarios = await dbConnect.prototype.getUsuarios();
        req.session.usuarios = {};
        req.session.usuariosORD = {};
        for(let i in usuarios){
            req.session.usuarios[usuarios[i].CD_USUARIO] = usuarios[i];
            req.session.usuariosORD[i] = usuarios[i];
        }
    }
    else{
        usuarios = req.session.usuariosORD;
    }
    return usuarios;
}

module.exports = router;