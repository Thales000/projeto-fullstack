const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const server = require('http').createServer(app);
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const bcrypt = require('bcrypt');
const rateLimit = require('express-rate-limit');
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

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

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

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    handler: (req, res) => {
        res.status(429).json({ error: "Muitas tentativas de login a partir deste IP, por favor, tente novamente após 15 minutos." });
    },
});

app.post('/search_user', [
    body('user').escape(),
    body('password').escape(),
], loginLimiter, async (req, res) => {
    const { user, password } = req.body;

    try {
        const foundUser = await User.findOne({ user: user });

        if (foundUser) {
            const isPasswordValid = await bcrypt.compare(password, foundUser.password);

            if (isPasswordValid) {
                //Gerar token JWT caso ache o usuário com senha correta
                const token = jwt.sign({ user: foundUser.user }, process.env.JWT_SECRET);

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
  
    } catch (error) {
      console.error('Erro ao salvar o log:', error);
    }
  });

    app.post('/register_user', async (req, res) => {
    try {

        const { user, password } = req.body;
        const foundUser = await User.findOne({ user: user });
        if(foundUser){
            return res.status(401).json({ error: "Usuário já existente" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ user, password: hashedPassword });
        await newUser.save();

        res.status(200).json({ message: 'Usuário cadastrado com sucesso' });
    } catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
        res.status(500).json({ error: 'Erro ao cadastrar usuário' });
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

        res.status(200).json({ message: "Herói inserido com sucesso" });
    } catch (error) {

        res.status(500).json({ error: "Erro ao cadastrar herói" });
    }
});

app.get('/get_heroes', verifyToken, async (req, res) => {
    try {
        const heroesFromCache = await redisClient.get('getAllHeroes');
        if(heroesFromCache){
            const parsedHeroes = JSON.parse(heroesFromCache);
            return res.json(parsedHeroes);
        }
        const heroes = await Hero.find(); // Obtém todos os heróis do MongoDB
        await redisClient.set('getAllHeroes', JSON.stringify(heroes), { EX: 120 });
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