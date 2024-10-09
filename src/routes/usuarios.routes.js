const express = require('express');
const router = express.Router();
const { postUsuario, getUsuarios, upload, deleteUsuario, editUsuarios, getUsuariosByNif, userLogin } = require('../controllers/usuarios.controllers');



// Rotas
router.post('/usuarios', upload.single('image'), postUsuario);  // Middleware de upload de imagem
router.get('/usuarios', getUsuarios);
router.get('/usuarios/:nif', getUsuariosByNif)
router.delete('/usuarios/:nif', deleteUsuario)
router.put('/usuarios/:nif', editUsuarios)
router.post('/usuarios/login', userLogin);

module.exports = router;
