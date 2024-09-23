const express = require('express');
const router = express.Router();
const { postUsuario, getUsuarios, upload, deleteUsuario, editUsuarios } = require('../controllers/usuarios.controllers');



// Rotas
router.post('/usuarios', upload.single('image'), postUsuario);  // Middleware de upload de imagem
router.get('/usuarios', getUsuarios);
router.delete('/usuarios/:nif', deleteUsuario)
router.put('/usuarios/:nif', editUsuarios)
module.exports = router;
