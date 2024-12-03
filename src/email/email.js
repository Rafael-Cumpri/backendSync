// Importando as dependências necessárias
const express = require('express'); // Framework para criar o servidor web
const cron = require('node-cron'); // Módulo para agendar tarefas cron
const db = require('../config/dbconfig'); // Conexão com o banco de dados
const nodemailer = require('nodemailer'); // Módulo para envio de e-mails

const app = express(); // Criando uma instância do servidor Express

// Função para buscar e-mails dos usuários com notificações ativadas
async function pegarEmails() {
    const query = `
        SELECT u.nome, u.email, u.notificacao, a.nome AS ambiente_nome
        FROM usuarios u
        JOIN historico h ON u.nif = h.funcionario
        JOIN ambientes a ON h.ambiente = a.numero_ambiente
        WHERE h.deleted = FALSE AND h.data_fim IS NULL;
    `;

    try {
        const resultado = await db.query(query); // Executa a consulta no banco de dados
        return resultado.rows.map(row => ({
            nome: row.nome.split(' ')[0], // Extrai o primeiro nome do usuário
            email: row.email, // E-mail do usuário
            notificacao: row.notificacao, // Status da notificação
            ambiente: row.ambiente_nome // Nome do ambiente reservado
        }));
    } catch (error) {
        console.error('Erro ao buscar e-mails:', error); // Loga o erro caso ocorra
        return [];
    }
}

// Configuração do transporte de e-mail com o Nodemailer
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // Servidor SMTP do Gmail
    port: 587, // Porta para comunicação não segura (STARTTLS)
    secure: false, // Indica que não é uma conexão SSL
    auth: {
        user: 'isabelasouzade.564@gmail.com', // Seu e-mail
        pass: 'aqiw fhpg blcd rodj' // Senha de aplicativo do Gmail
    }
});

// Agendamento de uma tarefa para envio de e-mails usando o cron
cron.schedule('38 13 * * 1-5', async () => { // Agendado para segunda a sexta-feira às 20:49
    const recipients = await pegarEmails(); // Busca os dados dos destinatários

    if (recipients.length === 0) {
        console.log('Nenhum destinatário encontrado.'); // Caso não encontre usuários
        return;
    }

    // Envia e-mails para cada destinatário com notificação ativada
    for (const { nome, email, notificacao, ambiente } of recipients) {
        if (notificacao) {
            const mensagemHTML = `
                <p>Olá ${nome},</p>
                <p>Este é um lembrete para devolver a chave do ambiente: <strong>${ambiente}</strong>.</p>
                <p>Obrigado!</p>
            `;

            const mensagemTexto = `Olá ${nome}, este é um lembrete para devolver a chave do ambiente: ${ambiente}. Obrigado!`;

            transporter.sendMail({
                from: 'Isabela Souza <isabelasouzade.564@gmail.com>', // Remetente
                to: email, // Destinatário
                subject: 'Lembrete: Devolução da chave', // Assunto do e-mail
                html: mensagemHTML, // Corpo do e-mail em HTML
                text: mensagemTexto // Corpo do e-mail em texto simples
            }).then(response => {
                console.log(`E-mail enviado com sucesso para ${nome} (${email}):`, response);
            }).catch(error => {
                console.error(`Erro ao enviar e-mail para ${nome} (${email}):`, error);
            });
        } else {
            console.log(`Notificação desativada para ${nome}, e-mail não enviado.`);
        }
    }
});

// Inicia o servidor na porta 3006 e exibe uma mensagem de confirmação no console
app.listen(3006, () => {
    console.log('Servidor rodando na porta 3006'); // Informando que o servidor está rodando corretamente
});
