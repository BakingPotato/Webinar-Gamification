const express = require('express');
const router = express.Router();

router.get('/', (req, res)=> {
 res.send('Hello World, programmed to work and not to feel, not even knowing if I am real')
})

module.exports = router;