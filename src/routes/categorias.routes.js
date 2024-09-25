const express = require('express');
const router = express.Router();
const { postCategorias, getCategorias, deleteCategoria, editCategoria } = require('../controllers/categorias.controllers');



// Rotas
router.post('/categorias', postCategorias);  
router.get('/categorias', getCategorias);
router.delete('/categorias/:id',deleteCategoria);
router.put('/categorias/:id', editCategoria);
module.exports = router; 
