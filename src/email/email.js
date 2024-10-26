const { response } = require('express');
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'isabelasouzade.564@gmail.com',
        pass: 'aqiw fhpg blcd rodj'
    }
});

// Lista de destinatários
const recipients = [
    'isabela.souza7@aluno.senai.br',
    'caique.naimi@aluno.senai.br',
    'felipesantos@docente.senai.br'
];


transporter.sendMail({
    from: 'Isabela Souza <isabelasouzade.564@gmail.com>',
    to: recipients.join(', '),
    subject: 'Teste de envio de email #choracaique',
    html: '<h1>Olá, este é um teste de envio de email.oiiiiiiii</h1>',
    text: 'Olá, este é um teste de envio de email.oiiiii2'
}).then((response) => {
    console.log('Email enviado com sucesso:', response);
}).catch((error) => {
    console.error('Erro ao enviar email:', error);
});