require('dotenv').config();
const express = require('express');
const usuariosRoute = require('./routes/usuarios.routes');

const app = express();
const port = process.env.PORT || 3003;

app.use(express.json());

app.use('/usuarios', usuariosRoute);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
    });