const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const server = require('http').createServer(app);
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require("dotenv").config();
const PORT = 3001;
const Hero = require('./src/models/Hero');
const User = require('./src/models/User');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());

mongoose.connect(process.env.DB).then(() => {
    console.log('Conectado ao banco de dados com sucesso!');
}).catch((erro) => {
    console.log('Erro ao se conectar com ao banco de dados: ' + erro);
})

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return console.log("Acesso negado")
  
    jwt.verify(token, process.env.TOKEN_KEY, (err, user) => {
      if (err) return console.log("Token invalido")
      req.user = user;
      next();
    });
  };

app.post('/register_hero', verifyToken, async (req, res) => {
    try{
        const newHero = new Hero(req.body);
        await newHero.save();

        console.log("Herói inserido com sucesso: " + newHero);

    } catch (error) {
        console.error('Erro ao cadastrar herói:', error.message);
    }
});

app.get('/get_heroes', verifyToken , async (req, res) => {
    try {
        const heroes = await Hero.find(); // Obtém todos os heróis do MongoDB
        res.json(heroes);
    } catch (error) {
        console.error('Erro ao obter heróis:', error.message);
    }
});

app.post('/search_user', async (req, res) => {
    const { user, password } = req.body;
    console.log("JWT_SECRET",process.env.JWT_SECRET);


    try {
        const foundUser = await User.findOne({ user: user });

        if (foundUser) {

            if (foundUser.password === password) {
                //Gerar token JWT caso ache o usuário com senha correta
                var token = jwt.sign({ userId: foundUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
                console.log("token: ", token);
                res.json({ token: token });
            } else {
                //Senha incorreta
                console.log("Senha incorreta");
            }
        } else {
            //Usuário não encontrado
            console.log("Usuário não encontrado");
        }
    } catch (error) {
        console.error('Erro ao autenticar usuário:', error);
    }
});

server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
})