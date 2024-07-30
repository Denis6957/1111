import { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

// Компоненты для каждого этапа
import BrowserSelect from './components/BrowserSelect';
import TestSelect from './components/TestSelect';
import TestRunning from './components/TestRunning';
import TestResult from './components/TestResult';

function App() {
  const [currentStep, setCurrentStep] = useState(1); // Начинаем с выбора браузера
  const [selectedBrowser, setSelectedBrowser] = useState('chrome');
  const [selectedTest, setSelectedTest] = useState(null);
  const [logs, setLogs] = useState([]);
  const [testResult, setTestResult] = useState(null);
  const [tests, setTests] = useState([]); // Состояние для списка тестов

  // Получаем список тестов при монтировании компонента
  useEffect(() => {
    // Измененный URL запроса к backend
    axios.get('http://localhost:5000/api/tests') 
      .then(response => {
        setTests(response.data); // Сохраняем список тестов в состоянии
        if (response.data.length > 0) {
          setSelectedTest(response.data[0]); // Выбираем первый тест по умолчанию, если список не пустой
        }
      })
      .catch(error => console.error('Ошибка при получении списка тестов:', error));
  }, []);

  // Функция для запуска тестов
  const handleRunTests = () => {
    setLogs([]); // Очищаем логи перед запуском
    setTestResult(null); // Очищаем результаты предыдущего теста

    // Проверяем, выбран ли тест
    if (selectedTest) {
      axios.post('/api/run-tests', {
        browser: selectedBrowser,
        selectedTests: [selectedTest]
      })
        .then(() => {
          // ...
        })
        .catch(error => console.error('Ошибка при запуске тестов:', error));
    } else {
      console.error('Тест не выбран!');
    }
  };

  // Подключение к Socket.IO серверу
  useEffect(() => {
    const socket = io();

    socket.on('test-log', (message) => {
      setLogs(prevLogs => [...prevLogs, message]);
    });

    socket.on('test-report', (data) => {
      if (data.error) {
        setTestResult({ success: false, error: data.error });
      } else {
        setTestResult({ success: true, report: data.report });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Функция для перехода к следующему этапу
  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  // Функция для повтора теста
  const handleRepeatTest = () => {
    setCurrentStep(3); // Переход к этапу запуска теста
    handleRunTests(); // Запускаем тест заново
  };

  // Функция для возврата к началу
  const handleGoToStart = () => {
    setCurrentStep(1);
    setSelectedBrowser('chrome');
    setSelectedTest(null); // Сбрасываем выбранный тест
    setLogs([]);
    setTestResult(null);
  };

  return (
    <div className="App">
      <h1>UI для запуска TestCafe тестов</h1>

      {/* Отображение компонента в зависимости от текущего этапа */}
      {currentStep === 1 && (
        <BrowserSelect
          selectedBrowser={selectedBrowser}
          onSelect={setSelectedBrowser}
          onNext={handleNextStep}
        />
      )}
      {currentStep === 2 && (
        <TestSelect
          tests={tests} // Передаем список тестов в TestSelect
          selectedTest={selectedTest}
          onSelect={setSelectedTest}
          onNext={handleNextStep}
        />
      )}
      {currentStep === 3 && (
        <TestRunning logs={logs} />
      )}
      {currentStep === 4 && (
        <TestResult
          testResult={testResult}
          onGoToStart={handleGoToStart}
          onRepeatTest={handleRepeatTest}
        />
      )}
    </div>
  );
}

export default App;