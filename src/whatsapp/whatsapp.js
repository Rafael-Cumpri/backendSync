const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cron = require('node-cron');
const db = require('../config/dbconfig');

const app = express();
const PORT = 3001;

app.use(bodyParser.json());

// Função para obter todos os nomes e números de telefone dos usuários
async function getContatos() {
    const query = 'SELECT nome, telefone FROM usuarios';
    try {
        const result = await db.query(query);
        // Retorna uma lista de contatos
        return result.rows.map(row => ({
            nome: row.nome,
            telefone: formatPhone(row.telefone)
        }));
    } catch (error) {
        console.error('Erro ao buscar contatos:', error);
        return [];
    }
}
// Função para formatar o número de telefone
function formatPhone(phone) {
    // tira caracteres não numéricos
    const cleaned = phone.replace(/\D/g, '');
    // ve se o número já possui o código do país
    if (cleaned.startsWith('55')) {
        return cleaned; // ja ta no formato correto
    } else {
        return `55${cleaned}`; // add o código do país
    }
}

// Enviar mensagem
app.post('/send-message', async (req, res) => {
    const { phone, message } = req.body;

    try {
        const response = await axios.post('http://localhost:3000/api/sendText', {
            chatId: `+55${phone}@c.us`,
            text: message,
            session: 'default',
        });

        res.status(200).json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Falha ao enviar mensagem' });
    }
});

// Agendar a mensagem
cron.schedule('43 15 * * 1-5', async () => {
    const contatos = await getContatos();

    if (contatos.length === 0) {
        console.log('Nenhum contato encontrado');
        return;
    }

    for (const contato of contatos) {
        const { nome, telefone } = contato;
        const message = `Olá ${nome}, esta é uma mensagem agendada!`;

        try {
            await axios.post('http://localhost:3000/api/sendText', {
                chatId: `${telefone}@c.us`,
                text: message,
                session: 'default',
            });
            console.log(`Mensagem enviada para ${nome} (${telefone}): ${message}`);
        } catch (error) {
            console.error(`Erro ao enviar mensagem para ${nome} (${telefone}):`, error);
        }
    }
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
