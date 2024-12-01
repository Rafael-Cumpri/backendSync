const pool = require("../config/dbconfig");
const addFixedClass = async (req, res) => {
    const { ambiente_id, usuario_id } = req.body;

    // Verificar se o ambiente já está fixado pelo usuário
    const checkQuery = "SELECT * FROM salas_fixas WHERE ambiente_id = $1 AND usuario_id = $2";
    try {
        const checkResult = await pool.query(checkQuery, [ambiente_id, usuario_id]);

        if (checkResult.rows.length > 0) {
            return res.status(400).json({ error: "Esta sala já está fixada pelo usuário." });
        }

        // Inserir o novo registro de sala fixa
        const query = "INSERT INTO salas_fixas (ambiente_id, usuario_id) VALUES ($1, $2)";
        const values = [ambiente_id, usuario_id];
        await pool.query(query, values);
        res.status(200).json({ message: "Sala fixa anexada com sucesso" });
    } catch (error) {
        console.error("Erro ao adicionar sala fixa:", error);
        res.status(500).json({ error: "Erro ao associar sala fixa" });
    }
};


const getFixedClasses = async (req, res) => {
    const { usuario_id } = req.params;

    try {
        const query = `
            SELECT s.id, a.nome AS ambiente_nome, a.numero_ambiente, a.capacidadeAlunos, a.tipodoambiente
            FROM salas_fixas s
            JOIN ambientes a ON s.ambiente_id = a.numero_ambiente
            WHERE s.usuario_id = $1
        `;
        const result = await pool.query(query, [usuario_id]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Erro ao buscar salas fixas:", error);
        res.status(500).json({ error: "Erro ao buscar salas fixas" });
    }
};


const deleteFixedClass = async (req, res) => {
    const { id } = req.params;

    try {
        const query = "DELETE FROM salas_fixas WHERE id = $1";
        const result = await pool.query(query, [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Sala fixa não encontrada." });
        }

        res.status(200).json({ message: "Sala fixa removida com sucesso" });
    } catch (error) {
        console.error("Erro ao excluir sala fixa:", error);
        res.status(500).json({ error: "Erro ao excluir sala fixa" });
    }
};


// Função para atualizar uma sala fixa
const updateFixedClass = async (req, res) => {
    const { id } = req.params;
    const { ambiente_id, usuario_id } = req.body;

    try {
        const query = `
            UPDATE salas_fixas
            SET ambiente_id = $1, usuario_id = $2
            WHERE id = $3
        `;
        const values = [ambiente_id, usuario_id, id];

        await pool.query(query, values);
        res.status(200).json({ message: "Sala fixa atualizada com sucesso" });
    } catch (error) {
        console.error("Erro ao atualizar sala fixa:", error);
        res.status(500).json({ error: "Erro ao atualizar sala fixa" });
    }
};

module.exports = {
    addFixedClass,
    getFixedClasses,
    deleteFixedClass,
    updateFixedClass
};
