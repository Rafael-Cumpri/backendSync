const pool = require('../config/dbconfig');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

// Configuração do multer para armazenamento temporário dos arquivos
const upload = multer({ dest: 'uploads/' });

async function postUsuario(req, res) {
    const { nif, nome, descriptor, notificacao, notiwhere, telefone, email, adm } = req.body;
    const image = req.file;

    if (!nif) {
        res.status(401).json({ message: 'O NIF precisa ser um valor real e valido!' });
    }

    if (!descriptor) {
        res.status(401).json({ message: 'Usuario sem descrição facial, mande outra imagem!' });
    }

    // Verifica se a imagem foi enviada
    if (!image) {
        return res.status(400).json({ message: image, nif, nome, descriptor, notificacao, notiwhere, telefone, email, adm });
    }

    // Cria o diretório para armazenar a imagem, se não existir
    const directory = path.join(__dirname, '..', '..', 'uploads', 'funcionarios', nome);
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

    imageURL = `/uploads/funcionarios/${encodeURIComponent(nome)}/${image.originalname}`

    // Adiciona o usuário ao banco de dados
    const query = `
        INSERT INTO usuarios (nif, nome, caminho_imagem, descriptor, notificacao, notiwhere, telefone, email, adm)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `;
    const values = [nif, nome, imageURL, descriptor, notificacao, notiwhere, telefone, email, adm];

    try {
        await pool.query(query, values);
        res.status(200).json({ message: 'Usuário adicionado com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
    }
}

async function getUsuarios(req, res) {
    const query = 'SELECT * FROM usuarios';

    try {
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
    }
}
/* async function getUsuariosByNif(req, res) {
  

    try {
        const { nif } = req.params;
        const result = await pool.query('SELECT * FROM usuarios WHERE nif = $1', [nif]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
    }
} */
async function getUsuarioByParam(req, res) {
    try {
        const { param } = req.params;
        let query, values;

        if (isNaN(param)) {
            // Buscar por nome
            query = "SELECT * FROM usuarios WHERE nome ILIKE $1";
            values = [`%${param}%`];
        } else {
            // Buscar por número do usuario
            query = 'SELECT * FROM usuarios WHERE nif = $1';
            values = [param];
        }

        const result = await pool.query(query, values);

        // console.log(result.rows[0])

        if (result.rows[0].length === 0) {
            return res.status(404).json({ message: 'Nenhum usuario encontrado' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao buscar usuario', error);
        res.status(500).send('Erro ao buscar usuario');
    }
}
//delete usuarios
async function deleteUsuario(req, res) {
    try {
        const { nif } = req.params;
        await pool.query('DELETE FROM usuarios WHERE nif = $1', [nif]);
        res.status(200).send({ mensagem: 'usuário deletado' });
    } catch (error) {
        console.error('erro ao excluir usuário', error);
        res.status(500).send('erro ao excluir usuário');
    }
};
//editar usuarios
async function editUsuarios(req, res) {
    const { nif } = req.params;
    const { nome, descriptor, notificacao, notiwhere, telefone, email, adm } = req.body;
    const image = req.file;

    console.log(image)

    // Verificações de campos obrigatórios
    if (!nif) {
        return res.status(401).json({ message: 'O NIF precisa ser um valor real e válido!' });
    }

    if (!descriptor) {
        return res.status(401).json({ message: 'Usuário sem descrição facial, mande outra imagem!' });
    }

    let imageURL;
    if (image) {
        // Diretório de armazenamento de imagens
        const directory = path.join(__dirname, '..', '..', 'uploads', 'funcionarios', nome);
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true });
        }

        // Move a nova imagem para o diretório correto
        const imagePath = path.join(directory, image.originalname);
        try {
            fs.renameSync(image.path, imagePath);  // Move o arquivo temporário
            imageURL = `/uploads/funcionarios/${encodeURIComponent(nome)}/${image.originalname}`;
        } catch (err) {
            return res.status(500).json({ message: 'Erro ao mover a imagem', error: err.message });
        }
    }

    // Cria o SQL de atualização, incluindo o caminho da imagem se ela for enviada
    const query = `
        UPDATE usuarios SET 
            nome = $1, 
            caminho_imagem = COALESCE($2, caminho_imagem), 
            descriptor = $3, 
            notificacao = $4, 
            notiwhere = $5, 
            telefone = $6, 
            email = $7, 
            adm = $8 
        WHERE nif = $9
    `;
    const values = [nome, imageURL, descriptor, notificacao, notiwhere, telefone, email, adm, nif];

    try {
        await pool.query(query, values);
        res.status(200).json({ mensagem: 'Usuário atualizado com sucesso' });
    } catch (error) {
        console.error('Erro ao atualizar usuário', error);
        res.status(500).json({ message: 'Erro ao atualizar usuário', error: error.message });
    }
}

async function userLogin(req, res) {
    const { email, nif } = req.body;

    if (!email || !nif) {
        res.status(401).json({ message: 'O email e o nif precisam ser preenchidos!' });
    }

    const query = 'SELECT * FROM usuarios WHERE email = $1 AND nif = $2';

    try {
        const result = await pool.query(query, [email, nif]);
        if (result.rows.length === 0) {
            res.status(401).json({ message: 'Usuario não encontrado!' });
        } else {
            if (result.rows[0].email === email && result.rows[0].nif === nif) {
                res.status(200).json(result.rows);
            } else {
                res.status(401).json({ message: 'Usuario não encontrado!' });
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
    }
}

async function deletarImagensSemUsuario(req, res) {
    try {
        // Diretório onde estão as pastas dos usuários
        const funcionariosDir = path.join(__dirname, '..', '..', 'uploads', 'funcionarios');

        // Obtenha a lista de pastas dentro de "funcionarios"
        const folders = fs.readdirSync(funcionariosDir);

        // Obtenha todos os nomes dos usuários do banco de dados
        const query = 'SELECT nome FROM usuarios';
        const result = await pool.query(query);
        const userNames = result.rows.map(user => user.nome);

        // Percorra as pastas e apague as que não estão associadas a nenhum usuário
        folders.forEach(folder => {
            if (!userNames.includes(folder)) {
                const folderPath = path.join(funcionariosDir, folder);
                fs.rmSync(folderPath, { recursive: true, force: true });
                console.log(`Pasta '${folder}' deletada, pois não está associada a nenhum usuário.`);
            }
        });

        res.status(200).json({ message: 'Pastas sem usuário associado foram deletadas com sucesso.' });
    } catch (error) {
        console.error('Erro ao deletar pastas sem usuário associado:', error);
        res.status(500).json({ message: 'Erro ao deletar pastas sem usuário associado', error: error.message });
    }
}
    async function atualizarNotificacoes(req, res) {
        const { nif } = req.params;
        const { notificacao, notiwhere } = req.body;

        console.log('Atualizando notificações para o NIF:', nif);  // Log para depuração

        // Verificações para garantir que os campos foram enviados corretamente
        if (notificacao == undefined || !notiwhere) {
            return res.status(400).json({ message: 'Os campos notificacao e notiwhere são obrigatórios.' });
        }

        const validOptions = ['whatsapp', 'email', 'ambos','nenhum'];
        if (!validOptions.includes(notiwhere)) {
            return res.status(400).json({ message: 'O campo notiwhere deve ser "whatsapp", "email", "ambos" e "nenhum".' });
        }

        // Atualizando as preferências no banco de dados
        const query = `
            UPDATE usuarios 
            SET notificacao = $1, notiwhere = $2 
            WHERE nif = $3
            RETURNING *;
        `;
        const values = [notificacao, notiwhere, nif];

        try {
            const result = await pool.query(query, values);
            if (result.rowCount === 0) {
                return res.status(404).json({ message: 'Usuário não encontrado.' });
            }

            // Retorna uma resposta de sucesso com o usuário atualizado
            res.status(200).json({ message: 'Preferências de notificações atualizadas com sucesso.', usuario: result.rows[0] });
        } catch (error) {
            console.error('Erro ao atualizar notificações:', error);
            res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
        }
    }


module.exports = { postUsuario, getUsuarios, upload, deleteUsuario, editUsuarios, getUsuarioByParam, userLogin, deletarImagensSemUsuario, atualizarNotificacoes };
