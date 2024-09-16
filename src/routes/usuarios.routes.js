const express = require('express');
const router = express.Router();
const { postUsuario, getUsuarios, upload } = require('../controllers/usuarios.controllers');

// Rotas
router.post('/usuarios', upload.single('image'), postUsuario);  // Middleware de upload de imagem
router.get('/usuarios', getUsuarios);

module.exports = router;
