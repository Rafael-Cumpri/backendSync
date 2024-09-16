const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuarios.controllers');

router.post('/usuarios', usuariosController.postUsuario);

module.exports = router;