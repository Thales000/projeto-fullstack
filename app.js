const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const server = require('http').createServer(app);
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const helmet = require('helmet');
const { body } = require('express-validator');
require("dotenv").config();
const PORT = 3001;
const redis = require('redis');
const redisClient = redis.createClient({
    host: 'localhost',
    port: 6379,
});
const Hero = require('./src/models/Hero');
const User = require('./src/models/User');
const Log = require('./src/models/Log');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(helmet());
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
    if (!token || token === 'Bearer null') {
        console.log("Acesso negado");
    }
    
    const tokenSplited = token.split(' ')[1];
    jwt.verify(tokenSplited, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.log("Token inválido");
        }
      req.user = user;
      next();
    });
};

app.post('/search_user', [
    body('user').escape(),
    body('password').escape(),
], async (req, res) => {
    const { user, password } = req.body;
    console.log("JWT_SECRET",process.env.JWT_SECRET);

    try {
        const foundUser = await User.findOne({ user: user });

        if (foundUser) {
            if (foundUser.password === password) {
                //Gerar token JWT caso ache o usuário com senha correta
                const token = jwt.sign({ user: foundUser.user }, process.env.JWT_SECRET);

                console.log("token: ", token);
                console.log({ token: token });
                res.json({ token: token });
            } else {
                console.log("Senha incorreta");
                res.status(401).json({ error: "Senha incorreta" });
            }
        } else {
            console.log("Usuário não encontrado");
            res.status(404).json({ error: "Usuário não encontrado" });
        }
    } catch (error) {
        console.error('Erro ao autenticar usuário:', error);
    }
});

app.post('/save_log', async (req, res) => {
    try {
      const logData = req.body;
      const newLog = new Log(logData);
      await newLog.save();
  
      console.log("Log salvo com sucesso!");
    } catch (error) {
      console.error('Erro ao salvar o log:', error);
    }
  });

  app.post('/register_hero', verifyToken, [
    body('imageURL').escape(),
    body('name').escape(),
    body('attr').escape(),
    body('attackType').escape(),
], async (req, res) => {
    try {
        if (!req.body.imageURL) {
            return res.status(401).json({ error: "Sem URL" });
        } else if (!req.body.name) {
            return res.status(401).json({ error: "Sem nome" });
        } else if (!req.body.attr) {
            return res.status(401).json({ error: "Sem atributo" });
        } else if (!req.body.attackType) {
            return res.status(401).json({ error: "Sem tipo de ataque" });
        }
        const newHero = new Hero(req.body);
        await newHero.save();

        await redisClient.del('getAllHeroes');

        console.log("Herói inserido com sucesso: " + newHero);
        res.status(200).json({ message: "Herói inserido com sucesso" });
    } catch (error) {
        console.log('Erro ao cadastrar herói:', error.message);
        res.status(500).json({ error: "Erro ao cadastrar herói" });
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
        await redisClient.set('getAllHeroes', JSON.stringify(heroes), { EX: 120 });
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