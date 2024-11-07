const pool = require('../config/dbconfig')

async function newPromiseClass(req, res) {
    const { data_inicio, funcionario, ambiente } = req.body;

    data_fim = null
    deleted = false

    const query = `INSERT INTO historico (data_inicio, data_fim, deleted, funcionario, ambiente) VALUES ($1, $2, $3, $4, $5)`;
    const values = [data_inicio, data_fim, deleted, funcionario, ambiente];

    try {
        await pool.query(query, values);
        await pool.query('UPDATE ambientes SET disponivel = false WHERE numero_ambiente = $1', [ambiente]);
        const responseAmbiente = await pool.query('SELECT * FROM ambientes WHERE numero_ambiente = $1', [ambiente]);
        if(responseAmbiente.rows[0].chave === true) {
            await pool.query('UPDATE chaves SET disponivel = false WHERE salas = $1', [ambiente]);
        }
        res.status(200).json({ message: 'Sala reservada com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
    }
}

async function getHistorico(req, res) {
    const query = `
        SELECT 
            historico.*, 
            usuarios.nome AS funcionario_nome, 
            usuarios.caminho_imagem AS funcionario_imagem,
            ambientes.nome AS ambiente_nome,
            ambientes.caminho_imagem AS ambiente_imagem
        FROM 
            historico
        JOIN 
            usuarios ON historico.funcionario = usuarios.nif
        JOIN 
            ambientes ON historico.ambiente = ambientes.numero_ambiente
    `;

    try {
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
    }
}

async function getHistoricoInfos(req, res) {
    const query = 'SELECT historico.id, historico.data_inicio, historico.data_fim, historico.deleted, usuarios.nome AS nome_usuario, ambientes.nome AS nome_ambiente, ambientes.caminho_imagem AS imagem_ambiente,ambientes.disponivel AS disponibilidade FROM historico JOIN usuarios ON historico.funcionario = usuarios.nif JOIN ambientes ON historico.ambiente = ambientes.numero_ambiente WHERE historico.deleted = FALSE;';

    try {
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
    }
}

async function deleteHistorico(req, res){
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM historico WHERE id = $1', [id]);
        res.status(200).send({ mensagem: 'historico deletado' });
    } catch (error) {
        console.error('erro ao excluir historico', error);
        res.status(500).send('erro ao excluir historico');
    }
}

async function updateHistorico(req, res) {
    try {
        const { id } = req.params;
        const { data_inicio, funcionario, ambiente } = req.body;
            await pool.query('UPDATE historico SET data_inicio = $1, funcionario = $2, ambiente = $3  WHERE id = $4', [ data_inicio, funcionario, ambiente, id]);
            res.status(200).send({ mensagem: 'historico atualizado' });
        
    } catch (error) {
        console.error('erro ao atualizar historico', error);
        res.status(500).send('erro ao atualizar historico');
    }
}

async function devolverAmbiente(req, res) {
    try {
        const { id, data_fim, funcionario, ambiente } = req.body;
        await pool.query('UPDATE historico SET data_fim = $1 WHERE id = $2', [data_fim, id])
        await pool.query('UPDATE ambientes SET disponivel = true WHERE numero_ambiente = $1', [ambiente])
        const responseAmbiente = await pool.query('SELECT * FROM ambientes WHERE numero_ambiente = $1', [ambiente]);
        if(responseAmbiente.rows[0].chave === true) {
            await pool.query('UPDATE chaves SET disponivel = true WHERE salas = $1', [ambiente]);
        }
        res.status(200).send({ mensagem: 'atualizado com sucesso'})
    } catch (err) {
        console.error('erro ao devolver ambiente', err)
        res.status(500).send('Erro ao devolver ambiente')
    }
}

async function devolverAmbienteADM(req, res) {
    try {
        const { id } = req.params;
        const { data_fim } = req.body;
        
        await pool.query('UPDATE historico SET data_fim = $1 WHERE id = $2', [data_fim, id]);
        const responseHistorico = await pool.query('SELECT * FROM historico WHERE id = $1', [id]);
        await pool.query('UPDATE ambientes SET disponivel = true WHERE numero_ambiente = $1', [responseHistorico.rows[0].ambiente]);
        
        const responseAmbiente = await pool.query('SELECT * FROM ambientes WHERE numero_ambiente = $1', [id]);
        
        if (responseAmbiente.rows[0]?.chave === 'true') {
            await pool.query('UPDATE chaves SET disponivel = true WHERE salas = $1', [id]);
        }
        
        res.status(200).send({ mensagem: 'atualizado com sucesso' });
    } catch (err) {
        console.error('erro ao devolver ambiente', err);
        res.status(500).send('Erro ao devolver ambiente');
    }
}


module.exports = { newPromiseClass, getHistorico, deleteHistorico, updateHistorico, devolverAmbiente, getHistoricoInfos, devolverAmbienteADM };