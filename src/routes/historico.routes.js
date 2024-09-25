const express = require('express');
const router = express.Router();
const { newPromiseClass, getHistorico, deleteHistorico, updateHistorico } = require('../controllers/historico.controllers');



// Rotas
router.post('/historico', newPromiseClass); 
router.get('/historico', getHistorico);
router.delete('/historico/:id', deleteHistorico)
router.put('/historico/:id', updateHistorico)
module.exports = router;
