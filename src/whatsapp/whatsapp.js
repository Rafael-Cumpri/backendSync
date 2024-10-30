const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cron = require('node-cron'); // Certifique-se de que esta linha está incluída

const app = express();
const PORT = 3001; // Porta do seu backend

app.use(bodyParser.json());

// Enviar mensagem
app.post('/send-message', async (req, res) => {
    const { phone, message } = req.body;

    try {
        const response = await axios.post('http://localhost:3000/api/sendText', {
            chatId: `${phone}@c.us`,
            text: message,
            session: 'default', 
        });

        res.status(200).json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Falha ao enviar mensagem' });
    }
});

// Lista de destinatários
const recipients = [
    '5519983112990',
];

// Agendar a mensagem
cron.schedule('58 21 * * 1-5', async () => { 
    const message = 'é para essa mensagem chegar 21h58';
    for (const phone of recipients) {
        try {
            await axios.post('http://localhost:3000/api/sendText', {
                chatId: `${phone}@c.us`,
                text: message,
                session: 'default',
            });
            console.log(`Mensagem enviada para ${phone}: ${message}`);
        } catch (error) {
            console.error(`Erro ao enviar mensagem para ${phone}:`, error);
        }
    }
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
