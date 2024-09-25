const express = require('express');
const router = express.Router();
const { addFixedClass, getFixedClass, deleteFixedClass, updateFixedClass } = require('../controllers/salafixa.controllers');



// Rotas
router.post('/salasFixas', addFixedClass); 
router.get('/salasFixas', getFixedClass);
router.delete('/salasFixas/:id', deleteFixedClass)
router.put('/salasFixas/:id', updateFixedClass)
module.exports = router;
