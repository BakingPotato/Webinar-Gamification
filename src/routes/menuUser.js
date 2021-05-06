const express = require('express');
const router = express.Router();

//Importamos la conexión a la base de datos
const pool = require = ('../database');

router.get('/menu', (req, res)=> {
    res.render('menuUser/menu')
})

router.post('/menu', (req, res) => {
    const{ user, directedTo, question } = req.body;

    let request = new pool.request();
    res.send('received');
})
module.exports = router;
