import React from 'react';

function TestList({ tests }) {
  return (
    <ul>
      {tests.map(test => (
        <li key={test}>{test}</li>
      ))}
    </ul>
  );
}

export default TestList;