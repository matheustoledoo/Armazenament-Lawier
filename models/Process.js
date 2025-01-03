// models/Process.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const Process = sequelize.define('Process', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  numeroProcesso: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  acao: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  forum: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  vara: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  juiz: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  escrevente: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  emailVara: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  telefoneVara: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  requerente: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  advogadoRequerente: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  telefoneRequerente: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  emailRequerente: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  requerido: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  advogadoRequerido: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  telefoneRequerido: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  emailRequerido: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  perito: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  telefonePerito: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  emailPerito: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  assistenteTecnico: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  telefoneAssistenteTecnico: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  emailAssistenteTecnico: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  nomeacao: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  dataNomeacao: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  fontePagadora: {
    type: DataTypes.ENUM('PGE', 'Particular'),
    allowNull: false,
  },
  honorariosProvisorios: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  valorProvisorios: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  depositadoProvisorios: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  folhaProvisorios: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  honorariosDefinitivos: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  valorDefinitivos: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  depositadoDefinitivos: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  folhaDefinitivos: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  estimativaHonorarios: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  valorEstimativaHonorarios: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  deferidoJuiz: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  contestacaoParte: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  folhaEstimativaHonorario: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  justificativaHonorarios: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  dataJustificativa: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  peticaoRecebimento: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  valorPeticaoRecebimento: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  folhaPeticaoRecebimento: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  mle: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  dataMle: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  agendamentoVistoria: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  dataVistoria: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  laudoNaoIniciado: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  motivoNaoIniciado: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  dataNaoIniciado: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  laudoIniciado: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  conclusaoLaudo: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  dataConclusao: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  laudoParalisado: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  motivoParalisado: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  dataParalisado: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  esclarecimentosNaoIniciado: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  motivoNaoIniciadoEsclarecimentos: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  dataNaoIniciadoEsclarecimentos: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  esclarecimentosIniciado: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  conclusaoEsclarecimentos: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  dataConclusaoEsclarecimentos: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  esclarecimentosParalisado: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  motivoParalisadoEsclarecimentos: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  dataParalisadoEsclarecimentos: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'processes',
  timestamps: true, // Adds createdAt and updatedAt columns
});

// Relationships
Process.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Process, { foreignKey: 'userId', as: 'processes' });

module.exports = Process;