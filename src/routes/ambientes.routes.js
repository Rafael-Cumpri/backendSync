const express = require('express');
const router = express.Router();
const { postAmbientes, getAmbientes, upload, deleteAmbientes, editAmbientes, getAmbienteByName } = require('../controllers/ambientes.controllers');



// Rotas
router.post('/ambientes', upload.single('image'), postAmbientes);  
router.get('/ambientes', getAmbientes);
router.get('/ambientes/:nome', getAmbienteByName);
router.delete('/ambientes/:id', deleteAmbientes);
router.put('/ambientes/:id', editAmbientes);


module.exports = router; 
