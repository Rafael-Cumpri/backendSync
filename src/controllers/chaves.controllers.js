const pool = require('../config/dbconfig')

async function postNewKey(req, res) {
    const { id, disponivel, salas } = req.body;

    const query = `INSERT INTO chaves (id, disponivel, salas) VALUES ($1, $2, $3)`;
    const values = [id, disponivel, salas];

    if(!disponivel) {
        res.status(401).json({message : 'Chave já registrada com alguém'});
    }

    try {
        await pool.query(query, values);
        res.status(200).json({ message: 'Chave anexada com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
    }
}

async function getKeys(req, res) {
    const query = 'SELECT * FROM chaves';

    try {
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
    }
}

async function deleteKeys(req, res){
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM chaves WHERE id = $1', [id]);
        res.status(200).send({ mensagem: 'chave deletada' });
    } catch (error) {
        console.error('erro ao excluir chave', error);
        res.status(500).send('erro ao excluir chave');
    }
}

async function updateKeys(req, res) {
    try {
        const { id } = req.params;
        const { disponivel, salas } = req.body;
            await pool.query('UPDATE chaves SET disponivel = $1, salas = $2 WHERE id = $3', [ disponivel, salas, id]);
            res.status(200).send({ mensagem: 'chave atualizada' });
        
    } catch (error) {
        console.error('erro ao atualizar chave', error);
        res.status(500).send('erro ao atualizar chave');
    }
}

async function getKeyBySalasId(req, res) {
    const { salas } = req.params;
    const query = 'SELECT * FROM chaves WHERE salas = $1';
    const values = [salas];

    try {
        const result = await pool.query(query, values);
        res.status(200).json(result.rows);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
    }
}

module.exports = { postNewKey, getKeys, deleteKeys, updateKeys, getKeyBySalasId };