import React from 'react';

function LogOutput({ logs }) {
  return (
    <pre>
      {logs.map((log, index) => (
        <div key={index}>{log}</div>
      ))}
    </pre>
  );
}

export default LogOutput;