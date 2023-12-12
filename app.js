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
const redis = require('redis');
const redisClient = redis.createClient({
    host: 'localhost',
    port: 6379,
});

const Hero = require('./src/models/Hero');
const User = require('./src/models/User');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors({
    exposedHeaders: ['Authorization'],
}));

mongoose.connect(process.env.DB).then(() => {
    console.log('Conectado ao banco de dados com sucesso!');
}).catch((erro) => {
    console.log('Erro ao se conectar com ao banco de dados: ' + erro);
})

app.use((req, res, next) => {
    console.log("Headers da requisição: ", req.headers);
    next();
  });

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    console.log("token do verify: ", req.headers['authorization']);
    if (!token || token === 'Bearer null') return console.log("Acesso negado")
    
    const tokenSplited = token.split(' ')[1];
    jwt.verify(tokenSplited, process.env.JWT_SECRET, (err, user) => {
      if (err) return console.log("Token invalido")
      req.user = user;
      next();
    });
};

app.post('/search_user', async (req, res) => {
    const { user, password } = req.body;
    console.log("JWT_SECRET",process.env.JWT_SECRET);

    try {
        const foundUser = await User.findOne({ user: user });

        if (foundUser) {
            if (foundUser.password === password) {
                //Gerar token JWT caso ache o usuário com senha correta
                const token = jwt.sign({ userId: foundUser._id }, process.env.JWT_SECRET);
                console.log("token: ", token);
                console.log({ token: token });
                res.json({ token: token });
            } else {
                console.log("Senha incorreta");
            }
        } else {
            console.log("Usuário não encontrado");
        }
    } catch (error) {
        console.error('Erro ao autenticar usuário:', error);
    }
});

app.post('/register_hero', verifyToken, async (req, res) => {
    try{
        const newHero = new Hero(req.body);
        await newHero.save();

        await redisClient.del('getAllHeroes');

        console.log("Herói inserido com sucesso: " + newHero);

    } catch (error) {
        console.error('Erro ao cadastrar herói:', error.message);
    }
});
app.get('/get_heroes', verifyToken, async (req, res) => {
    try {
        const heroesFromCache = await redisClient.get('getAllHeroes');
        if(heroesFromCache){
            const parsedHeroes = JSON.parse(heroesFromCache);
            console.log("heroesFromCache: ", parsedHeroes)
            return res.json(parsedHeroes);
        }
        const heroes = await Hero.find(); // Obtém todos os heróis do MongoDB
        await redisClient.set('getAllHeroes', JSON.stringify(heroes), { EX: 60 });
        console.log("Heroes: ", heroes)
        res.json(heroes);
    } catch (error) {
        console.error('Erro ao obter heróis:', error.message);
    }
});

const startup = async() => {
    await redisClient.connect();
    server.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
    });
};
startup();