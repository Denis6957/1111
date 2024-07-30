import React, { useEffect, useState } from 'react';
import axios from 'axios';

function TestSelect({ onSelect, onNext }) {
  const [tests, setTests] = useState([]);

  useEffect(() => {
    axios.get('/api/tests')
      .then(response => setTests(response.data))
      .catch(error => console.error('Ошибка при получении списка тестов:', error));
  }, []);

  return (
    <div>
      <label htmlFor="test-select">Выберите тест:</label>
      <select 
        id="test-select"
        onChange={(e) => onSelect(e.target.value)}
      >
        {tests.map(test => (
          <option key={test} value={test}>
            {test}
          </option>
        ))}
      </select>

      <button onClick={onNext}>Далее</button>
    </div>
  );
}

export default TestSelect;