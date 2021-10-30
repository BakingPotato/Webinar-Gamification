const express = require('express');
const router = express.Router();
const dbConnect = require('../Memory')
const { isLoggedIn, isLoggedInAndAdmin } = require('../lib/auth');

//Menu de usuario
router.get('/seminario', isLoggedIn, async (req, res) => {
    if(req.session.usuario.ES_ADMIN == 1){
        res.redirect('/seminarioA')
    }else{
        res.render('seminario/menu');
    }
});

router.get('/seminario/ponentes', isLoggedIn, async (req, res) => {
    let ponentes = await getPonentes(req);
    let seminario = true;
    res.render('seminario/ponentes', {ponentes, seminario});
});

router.get('/seminario/ponentes/votar', isLoggedIn, async (req, res) => {
    const id  = req.query.CD_USUARIO;
    if(req.session.seminario.ponentes[id].VOTADO ){
        req.flash("message", "Eres listo, pero no lo suficiente");
        res.redirect('/seminario/ponentes');
    }else if(req.session.usuario.CD_USUARIO == id ){
        req.flash("message", "No puedes votarte a ti mismo");
        res.redirect('/seminario/ponentes');
    }else{
        req.session.seminario.ponentes = null;
        req.body.puntuacion = req.query.NM_PUNTOS;
        req.body.id = id;
        await dbConnect.prototype.votarPonente(req);
        req.flash("success", "Su voto fue emito con éxito");
        res.redirect('/seminario/ponentes');    
    }
});


router.get('/seminario/ponentes/actualizar', isLoggedIn, async (req, res) => {
    req.session.seminario.ponentes = null; //Reiniciamos la lista local de usuarios para volver a llenarla con lo que haya en la base de datos
    res.redirect('/seminario/ponentes')
});

router.get('/seminario/ponentes/preguntar/:id', isLoggedIn, async (req, res) => {
    req.session.seminario.CD_DIRIGIDO = req.params.id;
    let preguntas = await dbConnect.prototype.getPreguntasEspecificas(req);
    let usuario = req.session.seminario.ponentes[req.params.id];
    let seminario = true;
    res.render('seminario/preguntaNueva', {seminario, usuario, preguntas })
});

router.post('/seminario/ponentes/preguntar', isLoggedIn, async (req, res) => {
    await dbConnect.prototype.crearPregunta(req);
    req.session.seminario.CD_DIRIGIDO = null;
    req.flash("success", "Su pregunta ha sido realizada");
    res.redirect('/seminario/ponentes')
});


router.get('/seminario/usuarios', isLoggedIn, async (req, res) => {
    let usuarios = await getUsuarios(req);
    let soyAdmin = req.session.usuario.ES_ADMIN;
    let soyPonente = req.session.usuario.ES_PONENTE;
    let seminario = true;
    if (req.session.usuario.ES_ADMIN == 1) {
        let listaEspera = await getListaEspera(req);
        res.render('seminario/usuario', {usuarios, seminario, soyAdmin, soyPonente, listaEspera});
    } else{
        let pidioPonente = false;
        if(!req.session.usuario.PIDIO_PONENTE){
            pidioPonente = await  dbConnect.prototype.getEnListaDeEspera(req);
            req.session.usuario.PIDIO_PONENTE = pidioPonente;
        }else{
            pidioPonente = req.session.usuario.PIDIO_PONENTE;
        }
        res.render('seminario/usuario', {usuarios, seminario, soyAdmin, pidioPonente, soyPonente});
    }
});

router.get('/seminario/usuarios/actualizar', isLoggedIn, async (req, res) => {
    req.session.seminario.usuarios = null; //Reiniciamos la lista local de usuarios para volver a llenarla con lo que haya en la base de datos
    res.redirect('/seminario/usuarios')
});

router.get('/seminario/usuarios/otorgarPonente/:id', isLoggedInAndAdmin, async (req, res) => {
        const { id }  = req.params;
        if(id == req.session.usuario.CD_USUARIO){
            req.flash('message', 'Lamentablemente, no puedes darte el rol a ti mismo.');
            res.redirect('/seminario/usuarios');
        }
        res.redirect('/seminario/usuarios/ponencia/'+ id);
});

router.get('/seminario/usuarios/pedirPonente', isLoggedIn, async (req, res) => {
    await dbConnect.prototype.registrarEnListaPonentes(req);
    req.session.usuario.PIDIO_PONENTE = true;
    req.flash('success', 'Enhorabuena, has sido registrado en la lista, espere a que el administrador le de su turno de palabra');
    res.redirect('/seminario/usuarios');
});

router.get('/seminario/usuarios/ponencia/:id', isLoggedInAndAdmin, async (req, res) => {
    const ID  = req.params.id;
    const usuario = req.session.seminario.usuarios[ID];
    const tiempo = req.session.seminario.TIEMPO_PONENCIA;
    const ocultar = true;
    res.render('seminario/ponencia', {ID, usuario, tiempo, ocultar});
});

router.post('/seminario/usuarios/ponencia/:id', isLoggedInAndAdmin, async (req, res) => {
    const { id }  = req.params;
   await dbConnect.prototype.añadirRoldePonente(req);
    await dbConnect.prototype.votarPonentePonencia(req);
    req.session.seminario.usuarios = null;
    req.session.seminario.ponentes = null;
    req.flash('success', 'La ponencia ha acabado')
    res.redirect('/seminario/usuarios');
});

router.get('/seminario/preguntas', isLoggedIn, async (req, res) => {
    let preguntas = await getPreguntas(req);
    let seminario = true;
    res.render('seminario/preguntas', {preguntas, seminario});
});

router.get('/seminario/preguntas/votar/:id', isLoggedIn, async (req, res) => {
    const { id }  = req.params;
    if(req.session.seminario.preguntas[id].VOTADO ){
        req.flash("message", "Eres listo, pero no lo suficiente");
        res.redirect('/seminario/preguntas');
    }else if(req.session.usuario.CD_USUARIO == id ){
        req.flash("message", "No puedes votarte a ti mismo");
        res.redirect('/seminario/preguntas');
    }else{
        // req.session.seminario.preguntas[id].VOTADO = true;
        // req.session.seminario.preguntas[id].NM_VOTOS += 5;
        req.session.seminario.preguntas = null;
        req.body.puntuacion = 1;
        await dbConnect.prototype.votarPregunta(req);
        req.flash("success", "Su voto fue emitido con éxito");
        res.redirect('/seminario/preguntas');    
    }
});

router.get('/seminario/preguntas/desvotar', isLoggedIn, async (req, res) => {
        const id  = req.query.CD_CUESTION;
        req.session.seminario.preguntas = null;
        req.body.puntuacion = 1;
        await dbConnect.prototype.desvotarPregunta(req);
        req.session.seminario.preguntas = null;
        req.flash("success", "Su voto fue retirado con éxito");
        res.redirect('/seminario/preguntas');    
});

router.get('/seminario/preguntas/actualizar', isLoggedIn, async (req, res) => {
    req.session.seminario.preguntas = null; //Reiniciamos la lista local de usuarios para volver a llenarla con lo que haya en la base de datos
    res.redirect('/seminario/preguntas')
});



async function getPreguntas(req){
    let preguntas = {};
    if(!req.session.seminario.preguntas){
        preguntas = await dbConnect.prototype.getPreguntas(req);
        req.session.seminario.preguntas = {};
        req.session.seminario.preguntasORD = {};
        for(let i in preguntas){
            req.session.seminario.preguntas[preguntas[i].CD_CUESTION] = preguntas[i];
            req.session.seminario.preguntasORD[i] = preguntas[i];
        }
    }
    else{
        preguntas = req.session.seminario.preguntasORD;
    }
    return preguntas;
}

async function getPonentes(req){
    let ponentes = {};
    if(!req.session.seminario.ponentes){
        ponentes = await dbConnect.prototype.getPonentes(req);
        req.session.seminario.ponentes = {};
        req.session.seminario.ponentesORD = {};
        for(let i in ponentes){
            req.session.seminario.ponentes[ponentes[i].CD_USUARIO] = ponentes[i];
            req.session.seminario.ponentesORD[i] = ponentes[i];
        }
        if(req.session.seminario.ponentes[req.session.usuario.CD_USUARIO]) req.session.usuario.ES_PONENTE = true;
    }
    else{
        ponentes = req.session.seminario.ponentesORD;
    }
    return ponentes;
}

async function getUsuarios(req){
    let usuarios = {};
    if(! req.session.seminario.usuarios){
        usuarios = await dbConnect.prototype.getUsuariosSeminario(req);
        req.session.seminario.usuarios = {};
        req.session.seminario.usuariosORD = {};
        for(let i in usuarios){
            req.session.seminario.usuarios[usuarios[i].CD_USUARIO] = usuarios[i];
            req.session.seminario.usuariosORD[i] = usuarios[i];
        }
    }
    else{
        usuarios = req.session.seminario.usuariosORD;
    }
    return usuarios;
}

async function getListaEspera(req){
    let espera = {};
    espera = await dbConnect.prototype.getListaEspera(req);
    return espera;
}



module.exports = router;