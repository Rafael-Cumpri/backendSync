const express = require("express");
const router = express.Router();
const {
    addFixedClass,
    getFixedClasses,
    deleteFixedClass,
    updateFixedClass
} = require("../controllers/salafixa.controllers.js");

// Rota para adicionar uma sala fixa (associando um ambiente a um usuário)
router.post("/", addFixedClass);

// Rota para buscar as salas fixas de um usuário específico (por NIF)
router.get("/:usuario_id", getFixedClasses);

// Rota para deletar uma sala fixa (por ID)
router.delete("/:id", deleteFixedClass);

// Rota para atualizar uma sala fixa (por ID)
router.put("/:id", updateFixedClass);

module.exports = router;
