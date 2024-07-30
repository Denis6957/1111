const express = require('express');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'build')));

// Создаем HTTP сервер для Socket.IO (ВНЕ app.post)
const server = require('http').createServer(app);
const io = new Server(server); 

app.get('/api/tests', (req, res) => {
  const testDir = path.join(__dirname, 'tests');
  console.log('Получен запрос /api/tests');

  fs.readdir(testDir, (err, files) => {
    if (err) {
      console.error('Ошибка при чтении директории с тестами:', err);
      res.status(500).send('Ошибка сервера');
      return;
    }

    console.log('Файлы в папке tests:', files);

    const testFiles = files.filter(file => file.endsWith('.js'));
    res.json(testFiles);
  });
});

app.post('/api/run-tests', (req, res) => {
  const { browser, selectedTests } = req.body;

  let command = `testcafe ${browser}`;
  if (selectedTests && selectedTests.length > 0) {
    command += ` ${selectedTests.join(' ')}`;
  } else {
    command += ` tests/`;
  }

  console.log('Выполняемая команда:', command);

  const testProcess = exec(`testcafe ${browser} ${selectedTests.join(' ')}`, { cwd: __dirname });

  io.on('connection', (socket) => {
    console.log('Клиент подключен:', socket.id);

    const sendLogToClient = (message) => {
      socket.emit('test-log', message.toString());
    };

    testProcess.stdout.on('data', sendLogToClient);
    testProcess.stderr.on('data', sendLogToClient);

    testProcess.on('exit', (code, signal) => {
      if (code === 0) {
        res.send('Тесты завершены успешно!');

        const reportPath = path.join(__dirname, 'reports', 'report.json');
        fs.readFile(reportPath, 'utf8', (err, data) => {
          if (err) {
            console.error('Ошибка чтения файла отчёта:', err);
            socket.emit('test-report', { error: 'Ошибка чтения файла отчёта' });
          } else {
            try {
              const reportData = JSON.parse(data);
              socket.emit('test-report', { report: reportData });
            } catch (parseError) {
              console.error('Ошибка парсинга JSON отчёта:', parseError);
              socket.emit('test-report', { error: 'Ошибка парсинга отчёта' });
            }
          }
        });
      } else {
        res.status(500).send('Ошибка при выполнении тестов!');
        socket.emit('test-report', { error: 'Ошибка при выполнении тестов' });
      }
    });
  });

});

// Запуск сервера 
server.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});