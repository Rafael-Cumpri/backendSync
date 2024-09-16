const pool = require('../config/dbconfig');
const fs = require('fs');
const path = require('path');

async function postUsuario(req, res) {
    const { nif, nome, descriptor, notificacao, notiwhere, telefone, email, adm, salas, sala_fixa } = req.body;
    const image = req.file;

    // Create the directory if it doesn't exist
    const directory = path.join(__dirname, '..', '..', 'uploads', nome);
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }

    // Move the uploaded image to the directory
    const imagePath = path.join(directory, image.originalname);
    fs.renameSync(image.path, imagePath);

    // Add the user to the database
    const query = `
        INSERT INTO usuarios (nif, nome, caminho_imagem, descriptor, notificacao, notiwhere, telefone, email, adm, salas, sala_fixa)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    `;
    const values = [nif, nome, imagePath, descriptor, notificacao, notiwhere, telefone, email, adm, salas, sala_fixa];

    try {
        await pool.query(query, values);
        res.status(200).json({ message: 'Usuário adicionado com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
}

module.exports = { postUsuario };