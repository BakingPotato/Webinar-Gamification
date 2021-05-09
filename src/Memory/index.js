const pool = require('../database');
const IDriver = require('./IDriver');

class databaseConnect extends IDriver {

    async getSeminariosActivos(){
        const request = new pool.Request();
        const result = await request.execute('OBTENER_SEMINARIOS_ACTIVOS')
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

    async ObtenerSusSeminarios(req){
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

    async ActualizarSeminario(req){
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
    
}

module.exports = databaseConnect; 