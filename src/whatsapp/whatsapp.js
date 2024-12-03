// Importação das dependências necessárias
const express = require('express');  // Framework para criar o servidor web
const bodyParser = require('body-parser');  // Middleware para parsing de JSON no corpo da requisição
const axios = require('axios');  // Biblioteca para fazer requisições HTTP
const cron = require('node-cron');  // Módulo para agendar tarefas cron
const db = require('../config/dbconfig');  // Conexão com o banco de dados (assumindo que você tem essa configuração)

const app = express();  // Cria uma instância do servidor Express
const PORT = 3003;  // Define a porta do servidor

// Configura o uso do bodyParser para interpretar JSON nas requisições
app.use(bodyParser.json());

// Função para obter todos os nomes, números de telefone e status de notificação dos usuários
async function getContatos() {
    const query = `
        SELECT u.nome AS usuario_nome, u.telefone, u.notificacao, a.nome AS ambiente_nome
        FROM usuarios u
        JOIN historico h ON u.nif = h.funcionario
        JOIN ambientes a ON h.ambiente = a.numero_ambiente
        WHERE h.deleted = FALSE AND h.data_fim IS NULL;
    `;


    try {
        const result = await db.query(query); // Executa a consulta no banco de dados
        return result.rows.map(row => ({
            nome: row.usuario_nome.split(' ')[0], // Pega o primeiro nome do usuário
            telefone: formatPhone(row.telefone), // Formata o número de telefone
            notificacao: row.notificacao, // Verifica se o usuário tem a notificação ativada
            ambiente: row.ambiente_nome // Nome do ambiente relacionado ao usuário
        }));
    } catch (error) {
        console.error('Erro ao buscar contatos:', error); // Caso ocorra um erro
        return []; // Retorna um array vazio em caso de erro
    }
}

// Função para formatar o número de telefone no padrão esperado (com código do país)
function formatPhone(phone) {
    const cleaned = phone.replace(/\D/g, '');  // Remove qualquer caractere não numérico (só deixa números)
    if (cleaned.startsWith('55')) {
        return cleaned;  // Se o número já começa com '55' (código do Brasil), retorna o número como está
    } else {
        return `55${cleaned}`;  // Caso contrário, adiciona o código do Brasil ('55') antes do número
    }
}

// Rota para enviar mensagem via API (requer o envio do número e a mensagem no corpo da requisição)
app.post('/send-message', async (req, res) => {
    const { phone, message, notificacao } = req.body;  // Extrai os dados do corpo da requisição

    try {
        // Faz a requisição para o servidor que envia a mensagem, passando o número formatado e a mensagem
        const response = await axios.post('http://localhost:3000/api/sendText', {
            chatId: notificacao ? `+55${phone}@c.us` : `${phone}@c.us`,  // Adiciona o prefixo do Brasil se a notificação estiver ativada
            text: message,  // A mensagem a ser enviada
            session: 'default',  // Identificador da sessão
        });

        // Retorna a resposta da requisição HTTP com status 200 (OK)
        res.status(200).json(response.data);
    } catch (error) {
        console.error(error);  // Se ocorrer erro ao enviar, loga no console
        res.status(500).json({ error: 'Erro interno ao processar a requisição' });  // Retorna erro 500 se falhar
    }
});
cron.schedule('19 13 * * 1-5', async () => {  // Agendamento de segunda a sexta-feira
    const contatos = await getContatos();  // Obtém a lista de contatos com reservas

    if (contatos.length === 0) {
        console.log('Nenhuma reserva encontrada.');
        return;
    }

    for (const contato of contatos) {
        const { nome, telefone, notificacao, ambiente } = contato;
        const message = `Olá ${nome}, não se esqueça de devolver a chave do ambiente: ${ambiente}!`;

        if (notificacao) {
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
    }
});


// Inicia o servidor na porta definida e loga uma mensagem de sucesso
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);  // Loga que o servidor está rodando
});
