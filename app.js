const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const server = require('http').createServer(app);
const https = require('https');
const PORT = 3001;
const Hero = require('./src/models/Hero');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(cors());

mongoose.connect('mongodb+srv://Thales000:xmongodbx321@clusterprojetoweb.tegkhw0.mongodb.net/dota2db').then(() => {
    console.log('Conectado ao banco de dados com sucesso!');
}).catch((erro) => {
    console.log('Erro ao se conectar com ao banco de dados: ' + erro);
})

app.post('/register_hero', async (req, res) => {
    try{
        const newHero = new Hero(req.body);
        await newHero.save();

        console.log("Herói inserido com sucesso: " + newHero);

    } catch (error) {
        console.error('Erro ao cadastrar herói:', error.message);
    }
  })

server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
})