const express = require('express');
const router = express.Router();
const { postAmbientes, getAmbientes, deleteAmbientes, editAmbientes } = require('../controllers/ambientes.controllers');



// Rotas
router.post('/ambientes', postAmbientes);  
router.get('/ambientes', getAmbientes);
router.delete('/ambientes/:id', deleteAmbientes);
router.put('/ambientes/:id', editAmbientes);


module.exports = router; 
