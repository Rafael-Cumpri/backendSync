// Importando as dependências necessárias
const express = require('express');  // Framework para criar o servidor web
const cron = require('node-cron');  // Módulo para agendar tarefas cron
const db = require('../config/dbconfig');  // Conexão com o banco de dados (assumindo que você tem essa configuração)
const nodemailer = require('nodemailer');  // Módulo para envio de emails

const app = express();  // Criando uma instância do servidor Express

// Função para pegar os e-mails dos usuários que desejam receber notificações
async function pegarEmails() {
    const query = 'SELECT nome, email, notificacao FROM usuarios';  // Consulta SQL para obter os dados dos usuários
    try {
        const resultado = await db.query(query);  // Executa a consulta no banco de dados
        // Retorna os dados dos usuários, formatando o nome e verificando se eles desejam receber notificações
        return resultado.rows.map(user => ({
            nome: user.nome.split(' ')[0],  // Pega apenas o primeiro nome
            email: user.email,  // Pega o e-mail do usuário
            notificacao: user.notificacao  // Verifica se o usuário quer receber notificações
        }));
    } catch (error) {
        console.error('Erro ao buscar e-mails:', error);  // Exibe o erro caso a consulta falhe
        return [];  // Retorna um array vazio em caso de erro
    }
}

// Configuração do transporte de e-mail com o Nodemailer
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',  // Servidor SMTP do Gmail
    port: 587,  // Porta para comunicação não segura (pode ser 465 para SSL)
    secure: false,  // Indica que não é uma conexão segura (pode ser alterado para true se usar SSL)
    auth: {
        user: 'isabelasouzade.564@gmail.com',  // Endereço de e-mail de envio
        pass: 'aqiw fhpg blcd rodj'  // Senha de aplicativo do Gmail
    }
});

// Agendamento de uma tarefa para envio de e-mails usando o cron
cron.schedule('49 20 * * 1-5', async () => {  // Tarefa agendada para rodar de segunda a sexta às 20:49
    const recipients = await pegarEmails();  // Obtém a lista de e-mails dos usuários
    if (recipients.length == 0) {  // Verifica se não há destinatários
        console.log('Nenhum destinatário encontrado.');  // Se não houver destinatários, loga no console
        return;  // Encerra a execução
    }

    // Envia um e-mail para cada destinatário que tenha a notificação ativada
    for (const { nome, email, notificacao } of recipients) {
        if (notificacao) {  // Verifica se a notificação está ativada para o usuário
            transporter.sendMail({
                from: 'Isabela Souza <isabelasouzade.564@gmail.com>',  // Remetente do e-mail
                to: email,  // Destinatário do e-mail
                subject: 'Teste de envio de email',  // Assunto do e-mail
                html: `<p>Olá ${nome}, este é um teste de envio de email.</p>`,  // Corpo do e-mail em HTML
                text: `Olá ${nome}, este é um teste de envio de email.`  // Corpo do e-mail em texto (para e-mails sem HTML)
            }).then((response) => {
                console.log(`Email enviado com sucesso para ${nome}:`, response);  // Loga a resposta caso o e-mail seja enviado com sucesso
            }).catch((error) => {
                console.error(`Erro ao enviar email para ${nome}:`, error);  // Loga o erro caso o envio falhe
            });
        } else {
            console.log(`E-mail não enviado para ${nome}: envio desativado.`);  // Loga que o envio foi desativado para o usuário
        }
    }
});

// Inicia o servidor na porta 3006 e exibe uma mensagem de confirmação no console
app.listen(3006, () => {
    console.log('Servidor rodando na porta 3003');  // Informa que o servidor está rodando na porta 3003 (erro no log, deveria ser 3006)
});
