const express = require('express');
const router = express.Router();
const { newPromiseClass, getHistorico, deleteHistorico, updateHistorico, devolverAmbiente, getHistoricoInfos } = require('../controllers/historico.controllers');



// Rotas
router.post('/historico', newPromiseClass); 
router.get('/historico', getHistorico); 
router.get('/historico/infos', getHistoricoInfos); 
router.delete('/historico/:id', deleteHistorico)
// router.put('/historico/:id', updateHistorico)
router.put('/historico', devolverAmbiente)

module.exports = router;
