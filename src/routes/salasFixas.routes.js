const express = require("express");
const router = express.Router();
const {
    addFixedClass,
    getFixedClasses,
    deleteFixedClass,
    updateFixedClass
} = require("../controllers/salafixa.controllers.js");

// Rotas para salas fixas
router.post('/salas-fixas', addFixedClass);               // Adicionar uma sala fixa
router.get('/salas_fixas/:usuario_id', getFixedClasses);      // Obter salas fixas de um usuário
router.delete('/salas-fixas/:id', deleteFixedClass);           // Deletar uma sala fixa
router.put('/salas-fixas/:id', updateFixedClass);              // Atualizar uma sala fixa
module.exports = router;
