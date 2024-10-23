const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = 3000; // Porta do seu backend

app.use(bodyParser.json());

// Endpoint para enviar mensagens
app.post('/send-message', async (req, res) => {
  const { phone, message } = req.body;

  try {
    const response = await axios.post('http://localhost:3000/api/sendText', {
      chatId: `${phone}@c.us`,
      text: message,
      session: 'default', // ou o nome da sua sessão
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:3000`);
});
