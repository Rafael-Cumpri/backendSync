const express = require('express');
const cron = require('node-cron');
const db = require('../config/dbconfig');
const app = express();
const nodemailer = require('nodemailer');

// Função para obter todos os e-mails dos usuários que desejam receber emails
async function pegarEmails() {
    const query = 'SELECT nome, email, notificacao FROM usuarios';
    try {
        const resultado = await db.query(query);
        return resultado.rows; // retorna os dados dos usuários
    } catch (error) {
        console.error('Erro ao buscar e-mails:', error);
        return [];
    }
}

// Configuração do transporte de email
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'isabelasouzade.564@gmail.com',
        pass: 'aqiw fhpg blcd rodj' // senha de aplicativo
    }
});

// Agendamento de tarefa para envio de email
cron.schedule('04 15 * * 1-5', async () => {
    const recipients = await pegarEmails();
    if (recipients.length == 0) {
        console.log('Nenhum destinatário encontrado.');
        return;
    }

    for (const { nome, email, notificacao } of recipients) {
        if (notificacao) {
            transporter.sendMail({
                from: 'Isabela Souza <isabelasouzade.564@gmail.com>',
                to: email,
                subject: 'Teste de envio de email',
                html: `<p>Olá ${nome}, este é um teste de envio de email.</p>`,
                text: `Olá ${nome}, este é um teste de envio de email.`
            }).then((response) => {
                console.log(`Email enviado com sucesso para ${nome}:`, response);
            }).catch((error) => {
                console.error(`Erro ao enviar email para ${nome}:`, error);
            });
        } else {
            console.log(`E-mail não enviado para ${nome}: envio desativado.`);
        }
    }
});

app.listen(3003, () => {
    console.log('Servidor rodando na porta 3003');
});
