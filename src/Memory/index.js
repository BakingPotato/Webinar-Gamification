const IDriver = require('./IDriver');
const pool = require('../database');
const helpers = require('../lib/helpers');

class databaseConnect extends IDriver {

    //BLOQUE Usuarios
    async getSeminarios(req){
        const request = new pool.Request();
        const result = await request
        .execute('OBTENER_SEMINARIOS')
        return result.recordset;
    }

    async getSeminariosActivos(req){
        const request = new pool.Request();
        const result = await request
        .input("CD_USUARIO", pool.Int, req.session.usuario.CD_USUARIO)
        .execute('OBTENER_SEMINARIOS_ACTIVOS')
        return result.recordset;
    }

    async getSeminariosParticipado(req){
        const request = new pool.Request();
        const result = await request
        .input("CD_USUARIO", pool.Int, req.session.usuario.CD_USUARIO)
        .execute('OBTENER_SEMINARIOS_PARTICIPADO')
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

    async getListaEspera(req){
        const request = new pool.Request();
        const result = await request
        .input("CD_SEMINARIO", pool.Int, req.session.seminario.CD_SEMINARIO)
        .execute('OBTENER_LISTA_ESPERA')
        return result.recordset;
    }


    async getUsuariosSeminario(req){
        const request = new pool.Request();
        const result = await request
        .input("CD_SEMINARIO", pool.Int, req.session.seminario.CD_SEMINARIO)
        .execute('OBTENER_RANKING_USUARIOS_POR_PUNTOS_PREGUNTA')
        return result.recordset;
    }

    async registrarseEnSeminario(username, pass, id){
        const request = new pool.Request();
        const result = await request
        .input("DS_CORREO", pool.VarChar(50), username)
        .input("CD_SEMINARIO", pool.Int, id)
        .execute('REGISTRAR_USUARIO_EN_SEMINARIO')
        return result.returnValue;
    }

    async actualizarUsuario(req){
        let pass =  req.body.DS_PASS == ''? null : await helpers.encryptPassword(req.body.DS_PASS) ;
        const request = new pool.Request();
        const result = await request
        .input("CD_USUARIO", pool.Int, req.session.usuario.CD_USUARIO)
        .input("DS_CORREO", pool.VarChar(50), req.body.DS_CORREO ? req.body.DS_CORREO : null)
        .input("DS_NOMBRE", pool.VarChar(50),  req.body.DS_NOMBRE ?  req.body.DS_NOMBRE : null)
        .input("DS_DESCRIPCION", pool.VarChar(250),  req.body.DS_DESCRIPCION ? req.body.DS_DESCRIPCION : null)
        .input("DS_PASS", pool.VarChar(50), pass)
        .input("DS_TWITTER", pool.VarChar(50),  req.body.DS_TWITTER ?  req.body.DS_TWITTER : null)
        .execute('ACTUALIZAR_USUARIO')
        if(result.returnValue != -2){
            req.session.usuario = {}; req.session.usuario = result.recordset[0];
        }
    return result.returnValue;
    }

    async registrarUsuario(req){
        const request = new pool.Request();
        const result = await request
            .input("DS_CORREO", pool.VarChar(50), req.body.DS_CORREO)
            .input("DS_NOMBRE", pool.VarChar(50),  req.body.DS_NOMBRE)
            .input("DS_PASS", pool.VarChar(50),  req.body.DS_PASS)
            .input("ES_ADMIN", pool.Bit, 0)
            .execute('REGISTRAR_USUARIO')
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

    async añadirRoldeAdmin(id){
        const request = new pool.Request();
        const result = await request
        .input("CD_USUARIO", pool.Int, id)
        .input("ES_ADMIN", pool.Bit, 1)
        .execute('ACTUALIZAR_USUARIO')
        return result.returnValue;
    }

    async añadirRoldePonente(req){
        const request = new pool.Request();
        const result = await request
        .input("CD_USUARIO", pool.Int, req.params.id)
        .input("CD_SEMINARIO", pool.Int, req.session.seminario.CD_SEMINARIO)
        .execute('OTORGAR_PONENTE_A_USUARIO')
        return result.returnValue;
    }

    
    async registrarEnListaPonentes(req){
        const request = new pool.Request();
        const result = await request
            .input("CD_USUARIO", pool.Int, req.session.seminario.CD_USUARIO)
            .input("CD_SEMINARIO", pool.Int, req.session.seminario.CD_SEMINARIO)
            .execute('REGISTRAR_USUARIO_LISTA_ESPERA')
        return result.returnValue;
    }

    async votarPonente(req){
        const request = new pool.Request();
        const result = await request
        .input("CD_ORIGEN", pool.Int, req.session.usuario.CD_USUARIO)
        .input("CD_SEMINARIO", pool.Int,  req.session.seminario.CD_SEMINARIO)
        .input("CD_DESTINO", pool.Int, req.body.id)
        .input("NM_PUNTOS", pool.Int, req.body.puntuacion)
        .execute('SUMAR_VOTOS_A_USUARIO')
        return result.returnValue;
    }


    //BLOQUE Seminarios

    async registrarSeminario(req){
        const request = new pool.Request();
        const result = await request
        .input("CD_USUARIO", pool.Int, req.session.usuario.CD_USUARIO)
        .input("DS_NOMBRE", pool.VarChar(50), req.body.DS_NOMBRE)
        .input("FECHA", pool.Date,  req.body.FECHA)
        .input("DS_DESCRIPCION", pool.VarChar(250),  req.body.DS_DESCRIPCION)
        .input("TIEMPO_PONENCIA", pool.Int,  req.body.TIEMPO_PONENCIA)
        .input("DS_HASHTAG", pool.VarChar(150), null)
        .execute('REGISTRAR_SEMINARIO')
        return result.returnValue;
    }

    async actualizarSeminario(req){
        const request = new pool.Request();
        let fecha =  req.body.FECHA == ''? null : req.body.FECHA ;
        const result = await request
        .input("CD_SEMINARIO", pool.Int, req.body.CD_SEMINARIO)
        .input("DS_NOMBRE", pool.VarChar(50),  req.body.DS_NOMBRE ?  req.body.DS_NOMBRE : null)
        .input("DS_DESCRIPCION", pool.VarChar(250),  req.body.DS_DESCRIPCION ? req.body.DS_DESCRIPCION : null)
        .input("FECHA", pool.Date,  fecha)
        .input("TIEMPO_PONENCIA", pool.Int,  req.body.TIEMPO_PONENCIA)
        .execute('ACTUALIZAR_SEMINARIO')
        return result.returnValue;
    }

    //BLOQUE Preguntas

    async getPreguntas(req){
        const request = new pool.Request();
        const result = await request
        .input("CD_SEMINARIO", pool.Int, req.session.seminario.CD_SEMINARIO)
        .input("CD_USUARIO", pool.Int, req.session.usuario.CD_USUARIO)
        .execute('OBTENER_RANKING_PREGUNTAS')
        return result.recordset;
    }

    async getPreguntasEspecificas(req){
        const request = new pool.Request();
        const result = await request
        .input("CD_SEMINARIO", pool.Int, req.session.seminario.CD_SEMINARIO)
        .input("CD_USUARIO", pool.Int, req.session.seminario.CD_DIRIGIDO)
        .execute('OBTENER_RANKING_PREGUNTAS_ESPECIFICAS')
        return result.recordset;
    }

    async crearPregunta(req){
        const request = new pool.Request();
        const result = await request
        .input("CD_ORIGEN", pool.Int, req.session.usuario.CD_USUARIO)
        .input("CD_DIRIGIDO", pool.Int, req.session.seminario.CD_DIRIGIDO)
        .input("CD_SEMINARIO", pool.Int,  req.session.seminario.CD_SEMINARIO)
        .input("DS_CUESTION", pool.VarChar(250), req.body.DS_CUESTION)
        .execute('REGISTRAR_PREGUNTA')
        return result.returnValue;
    }

    async votarPregunta(req){
        const request = new pool.Request();
        const result = await request
        .input("CD_CUESTION", pool.Int, req.params.id)
        .input("CD_ORIGEN", pool.Int, req.session.usuario.CD_USUARIO)
        .input("CD_SEMINARIO", pool.Int,  req.session.seminario.CD_SEMINARIO)
        .input("NM_VOTOS", pool.Int, req.body.puntuacion)
        .execute('SUMAR_VOTOS_A_PREGUNTA')
        return result.returnValue;
    }

    async desvotarPregunta(req){
        const request = new pool.Request();
        const result = await request
        .input("CD_CUESTION", pool.Int, req.query.CD_CUESTION)
        .input("CD_ORIGEN", pool.Int, req.session.usuario.CD_USUARIO)
        .input("CD_SEMINARIO", pool.Int,  req.session.seminario.CD_SEMINARIO)
        .input("NM_VOTOS", pool.Int, req.body.puntuacion)
        .execute('ELIMINAR_VOTOS_A_PREGUNTA')
        return result.returnValue;
    }

}

module.exports = databaseConnect; 