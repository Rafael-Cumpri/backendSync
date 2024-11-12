const express = require('express');
const router = express.Router();
const { postAmbientes, getAmbientes, upload, deleteAmbientes, updateAmbiente, getAmbienteByParam, deletarImagensSemAmbiente } = require('../controllers/ambientes.controllers');



// Rotas
router.post('/ambientes', upload.single('image'), postAmbientes);  
router.get('/ambientes', getAmbientes);
router.delete('/ambientes/:id', deleteAmbientes);
router.get('/ambientes/:param', getAmbienteByParam);
router.put('/ambientes/:id', upload.single('image'), updateAmbiente);
router.get('/ambientes/deletar/imagens', deletarImagensSemAmbiente);

module.exports = router; 
