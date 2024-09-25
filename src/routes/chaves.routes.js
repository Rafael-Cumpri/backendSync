const express = require('express');
const router = express.Router();
const { postNewKey, getKeys, deleteKeys, updateKeys } = require('../controllers/chaves.controllers');



// Rotas
router.post('/chaves', postNewKey); 
router.get('/chaves', getKeys);
router.delete('/chaves/:id', deleteKeys)
router.put('/chaves/:id', updateKeys)
module.exports = router;
