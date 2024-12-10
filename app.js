// app.js
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv = require('dotenv');
const { sequelize } = require('./config/database');
const moment = require('moment');



// Configuração de variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret_key',
  resave: false,
  saveUninitialized: true,
}));

// Registro de helpers do Handlebars
const hbs = exphbs.create({
  helpers: {
    formatDate: (date) => {
      if (!date) return ''; // Retorna vazio se a data for nula
      return moment(date).format('DD/MM/YYYY'); // Formato brasileiro
    },
    eq: (a, b) => a === b, // Helper para igualdade
  },
});

// Configuração do Handlebars
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', './views');

// Definir se o usuário está autenticado
app.use((req, res, next) => {
  const token = req.cookies.token;
  res.locals.isAuthenticated = !!token;
  next();
});

// Arquivos estáticos
app.use(express.static('public'));

// Rotas
const authRoutes = require('./routes/authRoutes');
const processRoutes = require('./routes/processRoutes');

app.use('/auth', authRoutes);
app.use('/process', processRoutes);

// Home route
app.get('/', (req, res) => {
  res.redirect('/process'); // Redireciona para a rota onde os processos estão sendo exibidos
});

// Conexão com o banco e início do servidor
sequelize.sync().then(() => {
    app.listen(3000, () => console.log('Server running on port 3000'));
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});