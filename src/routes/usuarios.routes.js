const express = require('express');
const router = express.Router();
const { postUsuario, getUsuarios, upload, deleteUsuario, editUsuarios, getUsuarioByParam, userLogin, deletarImagensSemUsuario, atualizarNotificacoes } = require('../controllers/usuarios.controllers');



// Rotas
router.post('/usuarios', upload.single('image'), postUsuario);  // Middleware de upload de imagem
router.get('/usuarios', getUsuarios);
router.get('/usuarios/:param', getUsuarioByParam)
router.delete('/usuarios/:nif', deleteUsuario)
router.put('/usuarios/:nif', upload.single('image'), editUsuarios)
router.post('/usuarios/login', userLogin);
router.get('/usuarios/deletar/imagens', deletarImagensSemUsuario);
router.put('/usuarios/:nif/notificacoes', atualizarNotificacoes);

module.exports = router;
