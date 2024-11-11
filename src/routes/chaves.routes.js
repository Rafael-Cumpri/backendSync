const express = require('express');
const router = express.Router();
const { postNewKey, getKeys, deleteKeys, updateKeys, getKeyBySalasId } = require('../controllers/chaves.controllers');



// Rotas
router.post('/chaves', postNewKey); 
router.get('/chaves', getKeys);
router.delete('/chaves/:id', deleteKeys)
router.put('/chaves/:id', updateKeys)
router.get('/chaves/:salas', getKeyBySalasId)

module.exports = router;
