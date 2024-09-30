const pool = require('../config/dbconfig');
const fs = require('fs');
const path = require('path');


async function postCategorias(req, res) {
    const {nome} = req.body;
   
    if (nome.length() < 3) {
        res.status(500).jaon({ message: 'categoria com nome muito pequeno' });
    }

    // Adiciona o usuário ao banco de dados
    const query = `
        INSERT INTO Categorias (nome)
        VALUES ($1)
    `;
    const values = [nome];

    try {
        await pool.query(query, values);
        res.status(200).json({ message: 'Categoria adicionado com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
    }
}

async function getCategorias(req, res) {
    const query = 'SELECT * FROM categorias';

    try {
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
    }
}
  
//delete Categorias
async function deleteCategoria (req, res) {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM Categorias WHERE id = $1', [id]);
        res.status(200).send({ mensagem: 'categoria deletada' });
    } catch (error) {
        console.error('erro ao excluir usuário', error);
        res.status(500).send('erro ao excluir categoria');
    }
    console.log('passou no delete');
    
};
//editar Categorias
async function editCategoria(req, res) {
    try {
        const { id } = req.params;
        const { nome } = req.body;


       
            await pool.query('UPDATE categorias SET nome = $1 WHERE id = $2', [nome, id]);
            res.status(200).send({ mensagem: ' categorias atualizado' });
        
    } catch (error) {
        console.error('erro ao atualizar categoria', error);
        res.status(500).send('erro ao atualizar categoria');
    }
}
module.exports = { postCategorias, getCategorias, deleteCategoria, editCategoria };
