const express = require('express');
const cron = require('node-cron');
const db = require('../config/dbconfig');
const app = express();

//nodemailer é uma biblioteca para envio de email
const nodemailer = require('nodemailer');



// Função para obter todos os e-mails dos usuários
async function pegarEmails() {
    const query = 'SELECT nome, email FROM usuarios';
    try {
        const resultado = await db.query(query);
        return resultado.rows; // retorna uma lista de e-mails
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
        // para gerar a senha de aplicativo, acesse: https://myaccount.google.com/apppasswords
        //essa nao é minha senha de email, é uma senha de aplicativo que o google  gera pra voce

        /*  Para gerar uma senha específica para aplicativos no Google, siga estes passos:
 
        Passo a Passo para Gerar uma Senha de Aplicativo
        Acesse sua Conta do Google:
 
        Vá para conta.google.com e faça login na sua conta.
        Segurança:
 
        No menu à esquerda, clique em Segurança.
        Verificação em Duas Etapas:
 
        Se ainda não estiver ativada, você precisará ativar a Verificação em Duas Etapas. Clique em Verificação em duas etapas e siga as instruções para ativá-la.
        Senhas de Aplicativos:
 
        Após ativar a verificação em duas etapas, você verá uma opção chamada Senhas de aplicativos. Clique nela.
        Se solicitado, faça login novamente.
        Gerar Senha:
 
        Você verá um menu onde pode escolher um aplicativo e um dispositivo (por exemplo, "Mail" e "Windows Computer"). Selecione o que for apropriado ou escolha "Outro (nome personalizado)" para nomear como preferir.
        Clique em Gerar.
        Copie a Senha:
 
        Uma senha de 16 caracteres será gerada. Copie esta senha e cole-a no seu código onde você está usando o Nodemailer. */

        //senha gerada pelo google
        pass: 'aqiw fhpg blcd rodj'
    }
});

cron.schedule('52 15 * * 1-5', async () => {
    const recipients = await pegarEmails();
    if (recipients.length == 0) {
        console.log('Nenhum destinatário encontrado.');
        return;
    }


    for (const { nome, email } of recipients) { 
        transporter.sendMail({
            from: 'Isabela Souza <isabelasouzade.564@gmail.com>',
            to: email,
            subject: 'Teste de envio de email #choracaique2',
            html: `<p>Olá ${nome}, este é um teste de envio de email.</p>`, 
            text: `Olá ${nome}, este é um teste de envio de email.`
        }).then((response) => {
            console.log(`Email enviado com sucesso para ${nome}:`, response);
        }).catch((error) => {
            console.error(`Erro ao enviar email para ${nome}:`, error);
        });
    }
});

app.listen(3003, () => {
    console.log('Servidor rodando na porta 3033');
});

