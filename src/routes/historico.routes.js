const express = require('express');
const router = express.Router();
const { newPromiseClass, getHistorico, deleteHistorico, updateHistorico, devolverAmbiente, getHistoricoInfos, devolverAmbienteADM, getFullHistorico } = require('../controllers/historico.controllers');



// Rotas
router.post('/historico', newPromiseClass); 
router.get('/historico/:id', getHistorico); 
router.get('/historico/infos', getHistoricoInfos); 
router.delete('/historico/:id', deleteHistorico)
// router.put('/historico/:id', updateHistorico)
router.put('/historico', devolverAmbiente)
router.post('/historico/devolver/:id', devolverAmbienteADM)
router.get('/historico/full', getFullHistorico)

module.exports = router;
