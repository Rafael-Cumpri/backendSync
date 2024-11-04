const pool = require('../config/dbconfig');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

// Configuração do multer para armazenamento temporário dos arquivos
const upload = multer({ dest: 'uploads/' });

async function postAmbientes(req, res) {
    const { nome, numero_ambiente, chave, capacidadeAlunos, tipodoambiente, ar_condicionado, ventilador, wifi, projetor, chave_eletronica, maquinas, disponivel, categoria } = req.body;
    const image = req.file;

    console.log(nome, numero_ambiente, chave, capacidadeAlunos, tipodoambiente, ar_condicionado, ventilador, wifi, projetor, chave_eletronica, maquinas, disponivel, categoria)

    // Verifica se a imagem foi enviada
    if (!image) {
        return res.status(400).json({ message: nome, numero_ambiente, chave, capacidadeAlunos, tipodoambiente, ar_condicionado, ventilador, wifi, projetor, chave_eletronica, maquinas, disponivel, categoria });
    }

    // Cria o diretório para armazenar a imagem, se não existir
    const directory = path.join(__dirname, '..', '..', 'uploads', 'ambientes', nome);
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }

    // Move a imagem para o diretório correto
    const imagePath = path.join(directory, image.originalname);
    try {
        fs.renameSync(image.path, imagePath);  // Move o arquivo temporário
    } catch (err) {
        return res.status(500).json({ message: 'Erro ao mover a imagem', error: err.message });
    }

    if (nome.length < 3) {
        res.status(401).json({ message: ' O nome do ambiente precisa ter mais que 3 letras.' });
    }

    if (!tipodoambiente) {
        res.status(401).json({ message: ' O ambiente precisa ter um tipo.' });
    }

    imageURL = `/uploads/ambientes/${encodeURIComponent(nome)}/${image.originalname}`

    // Adiciona o ambiente ao banco de dados
    const query = `
        INSERT INTO ambientes (nome, numero_ambiente, caminho_imagem, chave, capacidadeAlunos, tipodoambiente, ar_condicionado, ventilador, wifi, projetor, chave_eletronica, maquinas, disponivel, categoria)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    `;
    const values = [nome, numero_ambiente, imageURL, chave, capacidadeAlunos, tipodoambiente, ar_condicionado, ventilador, wifi, projetor, chave_eletronica, maquinas, disponivel, categoria];

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
        const result = await pool.query('SELECT * FROM ambientes WHERE numero_ambiente = $1', [id])  // Corrigido para "ambientes"
        if (result.rows[0].chave === true) {
            await pool.query('DELETE FROM chaves WHERE salas = $1', [id]);
        }
        await pool.query('DELETE FROM ambientes WHERE numero_ambiente = $1', [id]);
        res.status(200).send({ mensagem: 'Ambiente deletado' });
    } catch (error) {
        console.error('Erro ao excluir ambiente', error);
        res.status(500).send('Erro ao excluir ambiente');
    }
};


// Função para editar usuários
async function updateAmbiente(req, res) {
    const { id } = req.params;
    const { nome, numero_ambiente, chave, capacidadeAlunos, tipodoambiente, ar_condicionado, ventilador, wifi, projetor, chave_eletronica, maquinas, disponivel, categoria } = req.body;
    const image = req.file;

    if (nome && nome.length < 3) {
        return res.status(401).json({ message: 'O nome do ambiente precisa ter mais que 3 letras.' });
    }

    if (!tipodoambiente) {
        return res.status(401).json({ message: 'O ambiente precisa ter um tipo.' });
    }

    let imageURL;
    if (image) {
        const directory = path.join(__dirname, '..', '..', 'uploads', 'ambientes', nome);
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true });
        }

        const imagePath = path.join(directory, image.originalname);
        try {
            fs.renameSync(image.path, imagePath);
            imageURL = `/uploads/ambientes/${encodeURIComponent(nome)}/${image.originalname}`;
        } catch (err) {
            return res.status(500).json({ message: 'Erro ao mover a imagem', error: err.message });
        }
    }

    const query = `
        UPDATE ambientes 
        SET nome = $1, 
            numero_ambiente = $2, 
            caminho_imagem = COALESCE($3, caminho_imagem), 
            chave = $4, 
            capacidadeAlunos = $5, 
            tipodoambiente = $6, 
            ar_condicionado = $7, 
            ventilador = $8, 
            wifi = $9, 
            projetor = $10, 
            chave_eletronica = $11, 
            maquinas = $12, 
            disponivel = $13, 
            categoria = $14
        WHERE numero_ambiente = $15
    `;

    const values = [nome, numero_ambiente, imageURL, chave, capacidadeAlunos, tipodoambiente, ar_condicionado, ventilador, wifi, projetor, chave_eletronica, maquinas, disponivel, categoria, id];

    try {
        const ambienteAntigo = await pool.query('SELECT * FROM ambientes WHERE numero_ambiente = $1', [id]);
        let result;

        if (ambienteAntigo.rows[0].numero_ambiente !== numero_ambiente && ambienteAntigo.rows[0].chave === true) {
            await pool.query('DELETE FROM chaves WHERE salas = $1', [id]);
            result = await pool.query(query, values);
            await pool.query('INSERT INTO chaves (id, disponivel, salas) VALUES ($1, $2, $3)', [numero_ambiente, true, numero_ambiente]);
        }

        if (ambienteAntigo.rows[0].chave === false && chave === true) {
            result = await pool.query(query, values);
            await pool.query('INSERT INTO chaves (id, disponivel, salas) VALUES ($1, $2, $3)', [numero_ambiente, true, numero_ambiente]);
        } else if (ambienteAntigo.rows[0].chave === true && chave === false) {
            await pool.query('DELETE FROM chaves WHERE salas = $1', [numero_ambiente]);
            result = await pool.query(query, values);
        } else if (ambienteAntigo.rows[0].chave === true && chave === true) {
            await pool.query('DELETE FROM chaves WHERE salas = $1', [id]);
            result = await pool.query(query, values);
            await pool.query('INSERT INTO chaves (id, disponivel, salas) VALUES ($1, $2, $3)', [numero_ambiente, true, numero_ambiente]);
        } else if (ambienteAntigo.rows[0].chave === false && chave === false) {
            await pool.query('DELETE FROM chaves WHERE salas = $1', [numero_ambiente]);
            result = await pool.query(query, values);
        } else {
            console.log('Erro ao atualizar chave');
        }

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Ambiente não encontrado' });
        }

        res.status(200).json({ message: 'Ambiente atualizado com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
    }
}


async function getAmbienteById(req, res) {
    try {
        const { id } = req.params;
        const query = 'SELECT * FROM ambientes WHERE numero_ambiente = $1';
        const result = await pool.query(query, [id]);
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao buscar ambiente', error);
        res.status(500).send('Erro ao buscar ambiente');
    }
}



module.exports = { postAmbientes, getAmbientes, deleteAmbientes, updateAmbiente, getAmbienteById, upload };
