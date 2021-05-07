const pool = require('../database');
const IDriver = require('./IDriver');

class databaseConnect extends IDriver {

    async  getSeminariosActivos(){
        const request = new pool.Request();
        const result = await request.execute('OBTENER_SEMINARIOS_ACTIVOS')
        return result.recordset;
    }
}

module.exports = databaseConnect; 
