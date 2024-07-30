import React from 'react';

function TestRunning({ logs }) {
  return (
    <div>
      <h2>Тест выполняется...</h2>
      <div className="loader"></div> {/* Добавьте стили для анимации */}
      <pre className="logs">
        {logs.map((log, index) => (
          <div key={index}>{log}</div>
        ))}
      </pre>
    </div>
  );
}

export default TestRunning;