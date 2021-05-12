const pool = require('../database');
const IDriver = require('./IDriver');

class databaseConnect extends IDriver {

    //BLOQUE Usuarios

    async getSeminariosActivos(){
        const request = new pool.Request();
        const result = await request.execute('OBTENER_SEMINARIOS_ACTIVOS')
        return result.recordset;
    }

    async getUsuarios(){
        const request = new pool.Request();
        const result = await request.execute('OBTENER_USUARIO_Y_ADMIN')
        return result.recordset;
    }

    async getPonentes(req){
        const request = new pool.Request();
        const result = await request
        .input("CD_ORIGEN", pool.Int, req.session.usuario.CD_USUARIO)
        .input("CD_SEMINARIO", pool.Int, req.session.seminario.CD_SEMINARIO)
        .execute('OBTENER_PONENTES')
        return result.recordset;
    }


    async getUsuariosSeminario(){
        const request = new pool.Request();
        const result = await request
        .input("CD_SEMINARIO", pool.Int, req.session.seminario.CD_SEMINARIO)
        .execute('OBTENER_RANKING_USUARIOS')
        return result.recordset;
    }

    async registrarseEnSeminario(req, id_sem){
        const request = new pool.Request();
        const result = await request
        .input("CD_USUARIO", pool.Int, req.session.usuario.CD_USUARIO)
        .input("CD_SEMINARIO", pool.Int, req.session.seminarios[id_sem].CD_SEMINARIO)
        .execute('REGISTRAR_USUARIO_EN_SEMINARIO')
        return result.returnValue;
    }

    async actualizarUsuario(req){
        const request = new pool.Request();
        const result = await request
        .input("CD_USUARIO", pool.Int, req.session.usuario.CD_USUARIO)
        .input("DS_CORREO", pool.VarChar(50), req.body.DS_CORREO ? req.body.DS_CORREO : null)
        .input("DS_NOMBRE", pool.VarChar(50),  req.body.DS_NOMBRE ?  req.body.DS_NOMBRE : null)
        .input("DS_DESCRIPCION", pool.VarChar(250),  req.body.DS_DESCRIPCION ? req.body.DS_DESCRIPCION : null)
        .input("DS_PASS", pool.VarChar(50),  req.body.DS_PASS ?  req.body.DS_PASS : null)
        .input("DS_TWITTER", pool.VarChar(50),  req.body.DS_TWITTER ?  req.body.DS_TWITTER : null)
        .execute('ACTUALIZAR_USUARIO')
        req.session.usuario = {}; req.session.usuario = result.recordset[0];
        return result.returnValue;
    }

    async quitarRoldeAdmin(id){
        const request = new pool.Request();
        const result = await request
        .input("CD_USUARIO", pool.Int, id)
        .input("ES_ADMIN", pool.Bit, 0)
        .execute('ACTUALIZAR_USUARIO')
        return result.returnValue;
    }

    async añadirRoldePonente(usuarioID, seminarioID){
        const request = new pool.Request();
        const result = await request
        .input("CD_USUARIO", pool.Int, usuarioID)
        .input("CD_SEMINARIO", pool.Int, seminarioID)
        .execute('USUARIO_ES_PONENTE_SEMINARIO')
        return result.returnValue;
    }

    async añadirRoldePonente(id){
        const request = new pool.Request();
        const result = await request
        .input("CD_USUARIO", pool.Int, id)
        .input("ES_PONENTE", pool.Bit, 1)
        .execute('ACTUALIZAR_USUARIO')
        return result.returnValue;
    }

    async votarPonente(req){
        const request = new pool.Request();
        const result = await request
        .input("CD_ORIGEN", pool.Int, req.session.usuario.CD_USUARIO)
        .input("CD_SEMINARIO", pool.Int,  req.session.seminario.CD_SEMINARIO)
        .input("CD_DESTINO", pool.Int, req.params.id)
        .input("NM_PUNTOS", pool.Int, 5)
        .execute('SUMAR_VOTOS_A_USUARIO')
        return result.returnValue;
    }


    //BLOQUE Seminarios

    async registrarSeminario(req){
        const request = new pool.Request();
        const result = await request
        .input("CD_USUARIO", pool.Int, req.session.usuario.CD_USUARIO)
        .input("DS_NOMBRE", pool.VarChar(50), req.body.DS_NOMBRE)
        .input("DS_PASS", pool.Int, req.body.DS_PASS)
        .input("FECHA", pool.Date,  req.body.FECHA)
        .input("DS_DESCRIPCION", pool.VarChar(250),  req.body.DS_DESCRIPCION)
        .input("DS_HASHTAG", pool.VarChar(150), null)
        .execute('REGISTRAR_SEMINARIO')
        return result.returnValue;
    }

    async actualizarSeminario(req){
        const request = new pool.Request();
        const result = await request
        .input("CD_USUARIO", pool.Int, req.session.usuario.CD_USUARIO)
        .input("DS_CORREO", pool.VarChar(50), req.body.DS_CORREO ? req.body.DS_CORREO : null)
        .input("DS_NOMBRE", pool.VarChar(50),  req.body.DS_NOMBRE ?  req.body.DS_NOMBRE : null)
        .input("DS_DESCRIPCION", pool.VarChar(250),  req.body.DS_DESCRIPCION ? req.body.DS_DESCRIPCION : null)
        .input("DS_PASS", pool.VarChar(50),  req.body.DS_PASS ?  req.body.DS_PASS : null)
        .input("DS_TWITTER", pool.VarChar(50),  req.body.DS_TWITTER ?  req.body.DS_TWITTER : null)
        .execute('ACTUALIZAR_USUARIO')
        req.session.usuario = {}; req.session.usuario = result.recordset[0];
        return result.returnValue;
    }

    //BLOQUE Preguntas

    async getPreguntas(req){
        const request = new pool.Request();
        const result = await request
        .input("CD_SEMINARIO", pool.Int, req.session.seminario.CD_SEMINARIO)
        .execute('OBTENER_RANKING_PREGUNTAS')
        return result.recordset;
    }

    async crearPreguntas(req){
        const request = new pool.Request();
        const result = await request
        .input("CD_ORIGEN", pool.Int, req.session.usuario.CD_USUARIO)
        .input("CD_DIRIGIDO", pool.Int, req.params.id)
        .input("CD_SEMINARIO", pool.Int,  req.session.seminario.CD_SEMINARIO)
        .input("DS_CUESTION", pool.VarChar(250), req.body.DS_CUESTION)
        .execute('USUARIO_ES_PONENTE_SEMINARIO')
        return result.returnValue;
    }

    async votarPregunta(req){
        const request = new pool.Request();
        const result = await request
        .input("CD_CUESTION", pool.Int, req.params.id)
        .input("CD_ORIGEN", pool.Int, req.session.usuario.CD_USUARIO)
        .input("CD_SEMINARIO", pool.Int,  req.session.seminario.CD_SEMINARIO)
        .input("NM_VOTOS", pool.Int, req.body.NM_VOTOS)
        .execute('SUMAR_VOTOS_A_PREGUNTA')
        return result.returnValue;
    }

    
}

module.exports = databaseConnect; 