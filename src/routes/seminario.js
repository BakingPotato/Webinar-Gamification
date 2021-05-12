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
    res.render('seminario/ponentes', {ponentes});
});

router.get('/seminario/ponentes/votar/:id', isLoggedIn, async (req, res) => {
    const { id }  = req.params;
    if(req.session.seminario.ponentes[id].VOTADO ){
        req.flash("message", "Eres listo, pero no lo suficiente");
        res.redirect('/seminario/ponentes');
    }else if(req.session.usuario.CD_USUARIO == id ){
        req.flash("message", "No puedes votarte a ti mismo");
        res.redirect('/seminario/ponentes');
    }else{
        req.session.seminario.ponentes[id].VOTADO = true;
        req.session.seminario.ponentes[id].NM_PUNTOS += 5;
        await dbConnect.prototype.votarPonente(req);
        req.flash("success", "Su voto fue emito con éxito");
        res.redirect('/seminario/ponentes');    
    }
});


router.get('/seminario/ponentes/actualizar', isLoggedIn, async (req, res) => {
    req.session.seminario.ponente = null; //Reiniciamos la lista local de usuarios para volver a llenarla con lo que haya en la base de datos
    res.redirect('/seminario/ponentes')
});


async function getPreguntas(req){
    let preguntas = {};
    if(!req.session.seminario.preguntas){
        preguntas = await dbConnect.prototype.getPreguntas(req);
        req.session.seminario.preguntas = {};
        for(let i in preguntas){
            req.session.seminario.preguntas[preguntas[i].CD_CUESTION] = preguntas[i];
        }
    }
    else{
        preguntas = req.session.seminario.preguntas;
    }
    return preguntas;
}

async function getPonentes(req){
    let ponentes = {};
    if(!req.session.seminario.ponentes){
        ponentes = await dbConnect.prototype.getPonentes(req);
        req.session.seminario.ponentes = {};
        for(let i in ponentes){
            req.session.seminario.ponentes[ponentes[i].CD_USUARIO] = ponentes[i];
        }
    }
    else{
        ponentes = req.session.seminario.ponentes;
    }
    return ponentes;
}


module.exports = router;