const express = require('express');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const { Server } = require('socket.io');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, 'build')));

app.get('/api/tests', (req, res) => {
  // ... (ваш код для получения списка тестов)
});

// Создаем HTTP сервер для Socket.IO
const server = require('http').createServer(app); 
const io = new Server(server); 

io.on('connection', (socket) => {
  console.log('Клиент подключен:', socket.id);

  // Функция для отправки логов клиенту
  const sendLogToClient = (message) => {
    socket.emit('test-log', message.toString()); 
  };

  app.post('/api/run-tests', (req, res) => {
    const { browser, selectedTests } = req.body;

    let command = `testcafe ${browser}`;
    if (selectedTests && selectedTests.length > 0) {
      command += ` ${selectedTests.join(' ')}`;
    } else {
      command += ` tests/`;
    }

    console.log('Выполняемая команда:', command);

    const testProcess = exec(command, { cwd: __dirname });

    // Отправляем stdout и stderr на frontend в реальном времени
    testProcess.stdout.on('data', sendLogToClient);
    testProcess.stderr.on('data', sendLogToClient); 

    testProcess.on('exit', (code, signal) => {
      if (code === 0) {
        res.send('Тесты завершены успешно!');

        // ... (ваш код для отправки отчета)
      } else {
        res.status(500).send('Ошибка при выполнении тестов!');
        socket.emit('test-report', { error: 'Ошибка при выполнении тестов' });
      }
    });
  });
});

server.listen(port, () => { // Используем server.listen 
  console.log(`Сервер запущен на порту ${port}`);
});