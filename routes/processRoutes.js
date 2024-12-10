// routes/processRoutes.js
const express = require('express');
const Process = require('../models/Process');
const { authenticateToken } = require('./authRoutes');
const router = express.Router();
const moment = require('moment');
const hbs = require('handlebars');
const { Op } = require('sequelize');

// routes/processRoutes.js
router.get('/', async (req, res) => {
  try {
    const processes = await Process.findAll();
    console.log('Processos recuperados:', processes);
    res.render('home', { processes: processes.map(p => p.toJSON()), title: 'Bem-vindo à página inicial' });
  } catch (error) {
    console.error('Erro ao carregar os processos:', error);
    res.status(500).send('Erro ao carregar os processos.');
  }
});


// Create a new process
router.get('/create', authenticateToken, (req, res) => {
  res.render('createProcess');
});

router.post('/create', authenticateToken, async (req, res) => {
  try {
    const newProcess = await Process.create({
      ...req.body,
      userId: req.user.id, // Associate process with the logged-in user
    });
    res.redirect(`/`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// Get processes created by logged-in user ("My Processes")
router.get('/my-processes', authenticateToken, async (req, res) => {
  try {
    const processes = await Process.findAll({
      where: { userId: req.user.id }, // Filtra os processos pelo ID do usuário logado
    });
    res.render('myProcesses', { title: 'Meus Processos', processes: processes.map(p => p.toJSON()) });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao carregar seus processos.');
  }
});

hbs.registerHelper('formatDateForInput', function (date) {
  if (!date) return ''; // Retorna vazio se a data for nula ou indefinida
  return moment(date).format('YYYY-MM-DD'); // Formata para YYYY-MM-DD
});


// Edit a process
router.get('/edit/:id', authenticateToken, async (req, res) => {
  try {
    const process = await Process.findByPk(req.params.id);
    if (!process || process.userId !== req.user.id) {
      return res.status(403).send('Forbidden');
    }

    // Verifique e formate todas as datas no formato esperado pelo input type="date"
    const formattedProcess = {
      ...process.toJSON(),
      dataNomeacao: process.dataNomeacao ? moment(process.dataNomeacao).format('YYYY-MM-DD') : '',
      dataJustificativa: process.dataJustificativa ? moment(process.dataJustificativa).format('YYYY-MM-DD') : '',
      dataMle: process.dataMle ? moment(process.dataMle).format('YYYY-MM-DD') : '',
      dataVistoria: process.dataVistoria ? moment(process.dataVistoria).format('YYYY-MM-DD') : '',
      dataNaoIniciado: process.dataNaoIniciado ? moment(process.dataNaoIniciado).format('YYYY-MM-DD') : '',
      dataConclusao: process.dataConclusao ? moment(process.dataConclusao).format('YYYY-MM-DD') : '',
      dataParalisado: process.dataParalisado ? moment(process.dataParalisado).format('YYYY-MM-DD') : '',
      dataNaoIniciadoEsclarecimentos: process.dataNaoIniciadoEsclarecimentos
        ? moment(process.dataNaoIniciadoEsclarecimentos).format('YYYY-MM-DD')
        : '',
      dataConclusaoEsclarecimentos: process.dataConclusaoEsclarecimentos
        ? moment(process.dataConclusaoEsclarecimentos).format('YYYY-MM-DD')
        : '',
      dataParalisadoEsclarecimentos: process.dataParalisadoEsclarecimentos
        ? moment(process.dataParalisadoEsclarecimentos).format('YYYY-MM-DD')
        : '',
    };

    res.render('editProcess', { process: formattedProcess });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});



router.post('/edit/:id', authenticateToken, async (req, res) => {
  try {
      const process = await Process.findByPk(req.params.id);

      if (!process || process.userId !== req.user.id) {
          return res.status(403).send('Forbidden');
      }

      console.log('Dados recebidos do formulário:', req.body);

      // Função para converter arrays ou valores inválidos em strings
      const sanitizeString = (value) => {
          if (Array.isArray(value)) {
              return value.join(', '); // Concatena arrays em strings
          }
          return typeof value === 'string' ? value : String(value || '');
      };

      // Função para lidar com campos de data
      const formatDate = (date) => {
          if (!date || date === 'Invalid date') return null;
          return new Date(date);
      };

      // Sanitização de todos os campos
      const sanitizedData = {
          numeroProcesso: sanitizeString(req.body.numeroProcesso),
          acao: sanitizeString(req.body.acao),
          forum: sanitizeString(req.body.forum),
          vara: sanitizeString(req.body.vara),
          juiz: sanitizeString(req.body.juiz),
          escrevente: sanitizeString(req.body.escrevente),
          emailVara: sanitizeString(req.body.emailVara),
          telefoneVara: sanitizeString(req.body.telefoneVara),
          requerente: sanitizeString(req.body.requerente),
          advogadoRequerente: sanitizeString(req.body.advogadoRequerente),
          telefoneRequerente: sanitizeString(req.body.telefoneRequerente),
          emailRequerente: sanitizeString(req.body.emailRequerente),
          requerido: sanitizeString(req.body.requerido),
          advogadoRequerido: sanitizeString(req.body.advogadoRequerido),
          telefoneRequerido: sanitizeString(req.body.telefoneRequerido),
          emailRequerido: sanitizeString(req.body.emailRequerido),
          perito: sanitizeString(req.body.perito),
          telefonePerito: sanitizeString(req.body.telefonePerito),
          emailPerito: sanitizeString(req.body.emailPerito),
          assistenteTecnico: sanitizeString(req.body.assistenteTecnico),
          telefoneAssistenteTecnico: sanitizeString(req.body.telefoneAssistenteTecnico),
          emailAssistenteTecnico: sanitizeString(req.body.emailAssistenteTecnico),
          nomeacao: sanitizeString(req.body.nomeacao),
          dataNomeacao: formatDate(req.body.dataNomeacao),
          fontePagadora: sanitizeString(req.body.fontePagadora),
          honorariosProvisorios: req.body.honorariosProvisorios === 'true',
          valorProvisorios: parseFloat(req.body.valorProvisorios) || 0,
          depositadoProvisorios: req.body.depositadoProvisorios === 'true',
          folhaProvisorios: sanitizeString(req.body.folhaProvisorios),
          honorariosDefinitivos: req.body.honorariosDefinitivos === 'true',
          valorDefinitivos: parseFloat(req.body.valorDefinitivos) || 0,
          depositadoDefinitivos: req.body.depositadoDefinitivos === 'true',
          folhaDefinitivos: sanitizeString(req.body.folhaDefinitivos),
          estimativaHonorarios: req.body.estimativaHonorarios === 'true',
          valorEstimativaHonorarios: parseFloat(req.body.valorEstimativaHonorarios) || 0,
          deferidoJuiz: req.body.deferidoJuiz === 'true',
          contestacaoParte: sanitizeString(req.body.contestacaoParte),
          folhaEstimativaHonorario: sanitizeString(req.body.folhaEstimativaHonorario),
          justificativaHonorarios: sanitizeString(req.body.justificativaHonorarios),
          dataJustificativa: formatDate(req.body.dataJustificativa),
          peticaoRecebimento: req.body.peticaoRecebimento === 'true',
          valorPeticaoRecebimento: parseFloat(req.body.valorPeticaoRecebimento) || 0,
          folhaPeticaoRecebimento: sanitizeString(req.body.folhaPeticaoRecebimento),
          mle: sanitizeString(req.body.mle),
          dataMle: formatDate(req.body.dataMle),
          agendamentoVistoria: sanitizeString(req.body.agendamentoVistoria),
          dataVistoria: formatDate(req.body.dataVistoria),
          laudoNaoIniciado: req.body.laudoNaoIniciado === 'true',
          motivoNaoIniciado: sanitizeString(req.body.motivoNaoIniciado),
          dataNaoIniciado: formatDate(req.body.dataNaoIniciado),
          laudoIniciado: req.body.laudoIniciado === 'true',
          conclusaoLaudo: sanitizeString(req.body.conclusaoLaudo),
          dataConclusao: formatDate(req.body.dataConclusao),
          laudoParalisado: req.body.laudoParalisado === 'true',
          motivoParalisado: sanitizeString(req.body.motivoParalisado),
          dataParalisado: formatDate(req.body.dataParalisado),
          esclarecimentosNaoIniciado: req.body.esclarecimentosNaoIniciado === 'true',
          motivoNaoIniciadoEsclarecimentos: sanitizeString(req.body.motivoNaoIniciadoEsclarecimentos),
          dataNaoIniciadoEsclarecimentos: formatDate(req.body.dataNaoIniciadoEsclarecimentos),
          esclarecimentosIniciado: req.body.esclarecimentosIniciado === 'true',
          conclusaoEsclarecimentos: sanitizeString(req.body.conclusaoEsclarecimentos),
          dataConclusaoEsclarecimentos: formatDate(req.body.dataConclusaoEsclarecimentos),
          esclarecimentosParalisado: req.body.esclarecimentosParalisado === 'true',
          motivoParalisadoEsclarecimentos: sanitizeString(req.body.motivoParalisadoEsclarecimentos),
          dataParalisadoEsclarecimentos: formatDate(req.body.dataParalisadoEsclarecimentos),
      };

      await process.update(sanitizedData);

      res.redirect(`/process/${process.id}`);
  } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
  }
});


router.get('/search', async (req, res) => {
  try {
    const query = req.query.query;
    const processes = await Process.findAll({
      where: {
        [Op.or]: [
          { numeroProcesso: { [Op.like]: `%${query}%` } },
          { acao: { [Op.like]: `%${query}%` } },
          { forum: { [Op.like]: `%${query}%` } },
          { juiz: { [Op.like]: `%${query}%` } }
        ]
      }
    });

    // Converte os processos para objetos simples
    const plainProcesses = processes.map(process => process.get({ plain: true }));

    console.log('Processos encontrados:', plainProcesses); // Verificar os dados antes de enviar
    res.render('home', { processes: plainProcesses, query }); // Envia os dados e a query para a view
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao buscar processos.');
  }
});


// Delete a process
router.post('/delete/:id', authenticateToken, async (req, res) => {
  try {
    const process = await Process.findByPk(req.params.id);
    if (!process || process.userId !== req.user.id) {
      return res.status(403).send('Forbidden');
    }

    await process.destroy();
    res.redirect('/process/my-processes');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/:id', async (req, res) => {
  try {
    const process = await Process.findByPk(req.params.id);

    if (!process) return res.status(404).send('Process not found');

    // Formata todas as datas antes de enviar ao template
    const formattedProcess = {
      ...process.toJSON(),
      dataNomeacao: moment(process.dataNomeacao).format('DD/MM/YYYY'),
      dataJustificativa: moment(process.dataJustificativa).format('DD/MM/YYYY'),
      dataMle: moment(process.dataMle).format('DD/MM/YYYY'),
      dataVistoria: moment(process.dataVistoria).format('DD/MM/YYYY'),
      dataNaoIniciado: moment(process.dataNaoIniciado).format('DD/MM/YYYY'),
      dataConclusao: moment(process.dataConclusao).format('DD/MM/YYYY'),
      dataParalisado: moment(process.dataParalisado).format('DD/MM/YYYY'),
      dataNaoIniciadoEsclarecimentos: moment(process.dataNaoIniciadoEsclarecimentos).format('DD/MM/YYYY'),
      dataConclusaoEsclarecimentos: moment(process.dataConclusaoEsclarecimentos).format('DD/MM/YYYY'),
      dataParalisadoEsclarecimentos: moment(process.dataParalisadoEsclarecimentos).format('DD/MM/YYYY'),
    };

    res.render('processDetail', { process: formattedProcess });
  } catch (err) {
    console.error('Erro ao carregar os detalhes do processo:', err);
    res.status(500).send('Internal Server Error');
  }
});


module.exports = router;
