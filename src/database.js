const mysql = require('mysql');
const mssql = require('mssql');
const config = require('config');
const { promisify } = require('util');

const pool = mssql.connect(config.db); //Crea una conexion a una base de datos
//pool.request = promisify(pool.request)

module.exports = mssql;