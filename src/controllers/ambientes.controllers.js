const pool = require('../config/dbconfig');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

// Configuração do multer para armazenamento temporário dos arquivos
const upload = multer({ dest: 'uploads/' });

async function postAmbientes(req, res) {
    const { nome, chave, capacidadeAlunos, tipodoambiente, ar_condicionado, ventilador, wifi, projetor, chave_eletronica, maquinas, disponivel, categoria } = req.body;
    const image = req.file;
    let numero_ambiente = await pool.query('SELECT MAX(numero_ambiente) FROM ambientes');
    numero_ambiente = numero_ambiente.rows[0].max + 1;

    console.log(nome, chave, capacidadeAlunos, tipodoambiente, ar_condicionado, ventilador, wifi, projetor, chave_eletronica, maquinas, disponivel, categoria)

    // Verifica se a imagem foi enviada
    if (!image) {
        return res.status(400).json({ message: nome, chave, capacidadeAlunos, tipodoambiente, ar_condicionado, ventilador, wifi, projetor, chave_eletronica, maquinas, disponivel, categoria });
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
        res.status(200).json({ message: numero_ambiente});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
    }
}

async function getAmbientes(req, res) {
    console.log('Iniciando consulta de ambientes...');
    try {
        const result = await pool.query("SELECT * FROM ambientes");
       
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar ambientes:', error.message);
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
    const { nome, chave, capacidadeAlunos, tipodoambiente, ar_condicionado, ventilador, wifi, projetor, chave_eletronica, maquinas, disponivel, categoria, chaveNumero } = req.body;
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
            caminho_imagem = COALESCE($2, caminho_imagem), 
            chave = $3, 
            capacidadeAlunos = $4, 
            tipodoambiente = $5, 
            ar_condicionado = $6, 
            ventilador = $7, 
            wifi = $8, 
            projetor = $9, 
            chave_eletronica = $10, 
            maquinas = $11, 
            disponivel = $12, 
            categoria = $13
        WHERE numero_ambiente = $14
    `;

    const values = [nome, imageURL, chave, capacidadeAlunos, tipodoambiente, ar_condicionado, ventilador, wifi, projetor, chave_eletronica, maquinas, disponivel, categoria, id];

    try {
        const ambienteAntigo = await pool.query('SELECT * FROM ambientes WHERE numero_ambiente = $1', [id]);
        if (ambienteAntigo.rows[0].disponivel == false) {
            return res.status(401).json({ message: 'O ambiente não pode ser editado pois está ocupado.' });
        }

        await pool.query(query, values);

        if (chave == 'true') {
            const chaveExists = await pool.query('SELECT * FROM chaves WHERE salas = $1', [id]);
            if (chaveExists.rows.length === 0) {
                await pool.query('INSERT INTO chaves (id, disponivel, salas) VALUES ($1, $2, $3)', [chaveNumero, true, id]);
            }
        } else {
            await pool.query('DELETE FROM chaves WHERE salas = $1', [id]);
        }

        res.status(200).json({ message: 'Ambiente atualizado com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
    }
}


async function getAmbienteByParam(req, res) {

    console.log('passou aquiiiiafsdfasdfasdfasdfiiiii');

    try {
        const { param } = req.params;
        let query, values;

        if (isNaN(param)) {
            // Buscar por nome
            query = "SELECT * FROM ambientes WHERE nome ILIKE $1";
            values = [`%${param}%`];
        } else {
            // Buscar por número do ambiente
            query = 'SELECT * FROM ambientes WHERE numero_ambiente = $1';
            values = [param];
        }

        const result = await pool.query(query, values);

        if (result.rows[0].length === 0) {
            return res.status(404).json({ message: 'Nenhum ambiente encontrado' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao buscar ambiente', error);
        res.status(500).send('Erro ao buscar ambiente');
    }
}

async function deletarImagensSemAmbiente(req, res) {
    const query = 'SELECT * FROM ambientes';
    const result = await pool.query(query);

    const ambientes = result.rows;
    const directory = path.join(__dirname, '..', '..', 'uploads', 'ambientes');

    const files = fs.readdirSync(directory);
    for (const file of files) {
        if (!ambientes.find(ambiente => file === ambiente.nome)) {
            fs.rmdirSync(path.join(directory, file), { recursive: true });
        }
    }

    res.status(200).json({ message: 'Imagens deletadas com sucesso' });
}

module.exports = { postAmbientes, getAmbientes, deleteAmbientes, updateAmbiente, getAmbienteByParam, upload, deletarImagensSemAmbiente};
