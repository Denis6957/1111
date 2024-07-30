const express = require('express');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const { Server } = require('socket.io');

const app = express();
const port = process.env.PORT || 5000;

// Настройка  сервера  для  работы  со  статическими  файлами  (HTML,  CSS,  JS)
app.use(express.static(path.join(__dirname, 'build')));

// API  для  получения  списка  тестовых  файлов  из  папки  `tests`
app.get('/api/tests', (req, res) => {
  const testDir = path.join(__dirname, 'tests');

  fs.readdir(testDir, (err, files) => {
    if (err) {
      console.error('Ошибка  при  чтении  директории  с  тестами:', err);
      res.status(500).send('Ошибка  сервера');
      return;
    }

    // Фильтруем  файлы,  оставляя  только  JavaScript  файлы  (тесты)
    const testFiles = files.filter(file => file.endsWith('.js'));
    res.json(testFiles); 
  });
});

// API  для  запуска  тестов  TestCafe
app.post('/api/run-tests', (req, res) => {
  const { browser, selectedTests } = req.body;

  // Формирование  команды  для  запуска  TestCafe
  let command = `testcafe ${browser}`; 
  if (selectedTests && selectedTests.length > 0) {
    command += ` ${selectedTests.join(' ')}`; 
  } else {
    command += ` tests/`; 
  }

  console.log('Выполняемая  команда:', command);

  // Запуск  TestCafe  в  отдельном  процессе
  const testProcess = exec(command, { cwd: __dirname });

  // Перенаправление  вывода  TestCafe  в  консоль  сервера
  testProcess.stdout.pipe(process.stdout);
  testProcess.stderr.pipe(process.stderr);

  // Обработка  события  завершения  процесса  TestCafe
  testProcess.on('exit', (code, signal) => {
    if (code === 0) {
      res.send('Тесты  завершены  успешно!');

      // Чтение  отчёта  TestCafe  из  файла
      const reportPath = path.join(__dirname, 'reports', 'report.json'); 
      fs.readFile(reportPath, 'utf8', (err, data) => {
        if (err) {
          console.error('Ошибка  чтения  файла  отчёта:', err);
          socket.emit('test-report', { error: 'Ошибка  чтения  файла  отчёта' });
        } else {
          try {
            // Парсинг  JSON  данных  отчёта
            const reportData = JSON.parse(data);

            // Отправка  отчёта  клиенту  через  Socket.IO
            socket.emit('test-report', { report: reportData });
          } catch (parseError) {
            console.error('Ошибка  парсинга  JSON  отчёта:', parseError);
            socket.emit('test-report', { error: 'Ошибка  парсинга  отчёта' }); 
          }
        }
      });
    } else {
      res.status(500).send('Ошибка  при  выполнении  тестов!');
      socket.emit('test-report', { error: 'Ошибка  при  выполнении  тестов' });
    }
  });
});

// Создание  HTTP  сервера  для  Socket.IO
const server = require('http').createServer(app);
const io = new Server(server);

// Обработка  подключения  клиента  Socket.IO
io.on('connection', (socket) => {
  console.log('Клиент  подключен:', socket.id);

  // Функция  для  отправки  логов  тестов  клиенту
  const sendLogToClient = (message) => {
    socket.emit('test-log', message);
  };

  // Обработка  запроса  на  запуск  тестов
  app.post('/api/run-tests', (req, res) => {
    // ...  (код  запуска  тестов  из  предыдущего  листинга)

    // Отправка  логов  тестов  клиенту  в  режиме  реального  времени
    testProcess.stdout.on('data', sendLogToClient);
    testProcess.stderr.on('data', sendLogToClient);
  });
});

// Запуск  сервера
server.listen(port, () => {
  console.log(`Сервер  запущен  на  порту  ${port}`);
});