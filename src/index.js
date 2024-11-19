require('dotenv').config();
const express = require('express');
const cors = require('cors');
const https = require('https');
const fs = require('fs');
const path = require('path');

// Desabilitar a validação de certificados inválidos (apenas para desenvolvimento!)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const usuariosRoute = require('./routes/usuarios.routes');
const categoriasRoute = require('./routes/categorias.routes');
const salasFixasRoute = require('./routes/salasFixas.routes');
const historicoRoute = require('./routes/historico.routes');
const chavesRoute = require('./routes/chaves.routes');
const ambientesRoute = require('./routes/ambientes.routes');

// Carregar o certificado e a chave para HTTPS
const options = {
    key: fs.readFileSync('key.pem'), // Substitua pelo caminho correto se necessário
    cert: fs.readFileSync('cert.pem') // Substitua pelo caminho correto se necessário
};

const app = express();
const port = process.env.PORT || 3033; // Certifique-se de que está usando a porta 3033

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: 'https://192.168.69.191:3000' })); // Permitir o acesso do frontend específico

// Definindo as rotas
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use('/', usuariosRoute);
app.use('/', categoriasRoute);
app.use('/', salasFixasRoute);
app.use('/', historicoRoute);
app.use('/', chavesRoute);
app.use('/', ambientesRoute);

// Criar servidor HTTPS
https.createServer(options, app).listen(port, () => {
    console.log(`App listening on https://localhost:${port}`);
});
