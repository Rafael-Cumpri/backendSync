const express = require('express');
const router = express.Router();
const { newPromiseClass, getHistorico, deleteHistorico, updateHistorico, devolverAmbiente, getHistoricoInfos, devolverAmbienteADM, getFullHistorico, devolverTodosAmbientes } = require('../controllers/historico.controllers');



// Rotas
router.post('/historico', newPromiseClass); 
router.get('/historico/:id', getHistorico); 
router.get('/historico/infos/filtered', getHistoricoInfos);
router.get('/historico/full/infos', getFullHistorico); 
router.delete('/historico/:id', deleteHistorico)
router.put('/historico/todos', devolverTodosAmbientes) 
// router.put('/historico/:id', updateHistorico)
router.put('/historico', devolverAmbiente)
router.post('/historico/devolver/:id', devolverAmbienteADM)

module.exports = router;
