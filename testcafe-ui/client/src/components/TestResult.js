import React from 'react';

function TestResult({ testResult, onGoToStart, onRepeatTest }) {
  if (!testResult) {
    return null; 
  }

  return (
    <div>
      <h2>
        {testResult.success ? 'Тест пройден!' : 'Тест не пройден'}
      </h2>

      {testResult.error && <div className="error">Ошибка: {testResult.error}</div>}

      {/* Отображение логов, если тест завершен */}
      {testResult.report && (
        <div>
          <h3>Логи консоли:</h3> 
          {/* ... здесь будет логика отображения логов консоли */}

          <h3>Логи  из  файла  report.js:</h3>
          <pre>
            {JSON.stringify(testResult.report, null, 2)}
          </pre>
        </div>
      )}

      <button onClick={onGoToStart}>В начало</button>
      <button onClick={onRepeatTest}>Повторить тест</button> 
    </div>
  );
}

export default TestResult;