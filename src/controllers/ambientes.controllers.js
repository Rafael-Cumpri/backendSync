const pool = require('../config/dbconfig');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

// Configuração do multer para armazenamento temporário dos arquivos
const upload = multer({ dest: 'uploads/' });

async function postAmbientes(req, res) {
    const { nome, numero_ambiente, caminho_imagem, chave, capacidadeAlunos, tipodoambiente, ar_condicionado, ventilador, wifi, projetor, chave_eletronica, maquinas, categoria } = req.body;

    /*     // Cria o diretório para armazenar a imagem, se não existir
    const directory = path.join(__dirname, '..', '..', 'uploads', numero_ambiente);
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }

    // Move a imagem para o diretório correto
    const imagePath = path.join(directory, image.originalname);
    try {
        fs.renameSync(image.path, imagePath);  // Move o arquivo temporário
    } catch (err) {
        return res.status(500).json({ message: 'Erro ao mover a imagem', error: err.message });
    } */

    // Adiciona o ambiente ao banco de dados
    const query = `
        INSERT INTO ambientes (nome, numero_ambiente, caminho_imagem, chave, capacidadeAlunos, tipodoambiente, ar_condicionado, ventilador, wifi, projetor, chave_eletronica, maquinas, categoria)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    `;
    const values = [nome, numero_ambiente, caminho_imagem, chave, capacidadeAlunos, tipodoambiente, ar_condicionado, ventilador, wifi, projetor, chave_eletronica, maquinas, categoria];

    try {
        await pool.query(query, values);
        res.status(200).json({ message: 'Ambiente adicionado com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
    }
}

async function getAmbientes(req, res) {
    const query = 'SELECT * FROM ambientes';

    try {
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
    }
}

// Função para deletar usuários
// Função para deletar ambientes
async function deleteAmbientes(req, res) {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM ambientes WHERE id = $1', [id]);  // Corrigido para "ambientes"
        res.status(200).send({ mensagem: 'Ambiente deletado' });
    } catch (error) {
        console.error('Erro ao excluir ambiente', error);
        res.status(500).send('Erro ao excluir ambiente');
    }
};


// Função para editar usuários
async function editAmbientes(req, res) {
    try {
        const { id } = req.params;
        const { nome, numero_ambiente, caminho_imagem, chave, capacidadeAlunos, tipodoambiente, ar_condicionado, ventilador, wifi, projetor, chave_eletronica, maquinas, categoria } = req.body;
        
        const query = `
            UPDATE ambientes 
            SET nome = $1, 
                numero_ambiente = $2, 
                caminho_imagem = $3, 
                chave = $4, 
                capacidadeAlunos = $5, 
                tipodoambiente = $6, 
                ar_condicionado = $7, 
                ventilador = $8, 
                wifi = $9, 
                projetor = $10, 
                chave_eletronica = $11, 
                maquinas = $12, 
                categoria = $13
            WHERE id = $14
        `;

        const values = [nome, numero_ambiente, caminho_imagem, chave, capacidadeAlunos, tipodoambiente, ar_condicionado, ventilador, wifi, projetor, chave_eletronica, maquinas, categoria, id];

        await pool.query(query, values);
        res.status(200).send({ mensagem: 'Ambiente atualizado com sucesso' });
    } catch (error) {
        console.error('Erro ao atualizar ambiente', error);
        res.status(500).send('Erro ao atualizar ambiente');
    }
}



module.exports = { postAmbientes, getAmbientes, deleteAmbientes, editAmbientes };
