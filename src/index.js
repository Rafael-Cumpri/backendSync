require('dotenv').config();
const express = require('express');
const cors = require('cors'); 
const usuariosRoute = require('./routes/usuarios.routes');
const salasFixasRoute = require('./routes/salasFixas.routes')
const historicoRoute = require('./routes/historico.routes')
const app = express();
const port = process.env.PORT || 3003;

app.use(express.json());


app.use((req, res, next)=>{
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers","X-Custom-Header, Content-Type, Authorization")
    app.use(cors());
    next();
});

app.use('/', usuariosRoute);
app.use('/', salasFixasRoute)
app.use('/', historicoRoute)
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
    });