const pool = require('../config/dbconfig')

async function addFixedClass(req, res) {
    const { ambiente_id, usuario_id } = req.body;

    const query = `INSERT INTO salas_fixas (ambiente_id, usuario_id) VALUES ($1, $2)`;
    const values = [ambiente_id, usuario_id];

    try {
        await pool.query(query, values);
        res.status(200).json({ message: 'Sala anexada com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
    }
}

async function getFixedClass(req, res) {
    const query = 'SELECT * FROM salas_fixas';

    try {
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
    }
}

async function deleteFixedClass(req, res){
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM salas_fixas WHERE id = $1', [id]);
        res.status(200).send({ mensagem: 'sala fixa deletada' });
    } catch (error) {
        console.error('erro ao excluir sala fixa', error);
        res.status(500).send('erro ao excluir sala fixa');
    }
}

async function updateFixedClass(req, res) {
    try {
        const { id } = req.params;
        const { ambiente_id, usuario_id } = req.body;
            await pool.query('UPDATE salas_fixas SET ambiente_id = $1, usuario_id = $2 WHERE id = $3', [ ambiente_id, usuario_id, id]);
            res.status(200).send({ mensagem: ' sala fixa atualizada' });
        
    } catch (error) {
        console.error('erro ao atualizar sala fixa', error);
        res.status(500).send('erro ao atualizar sala fixa');
    }
}

module.exports = { addFixedClass, getFixedClass, deleteFixedClass, updateFixedClass };