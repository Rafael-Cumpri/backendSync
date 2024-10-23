/* const express = require('express');
const multer = require('multer');
const upload = multer();
const mailController = require('../controllers/email.controllers');

const router = express.Router();

router.post('/', upload.single('anexo'), (req, res) => {
    const { nome, email, mensagem } = req.body;
    const anexo = req.file;

    mailController(email, nome, mensagem, anexo)
        .then(response => res.json(response))
        .catch(error => res.json(error));
});

module.exports = router; */