import React, { useEffect, useState } from 'react';

function TestSelect({ tests, onSelect, onNext }) { // Принимаем tests как пропс
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true); 
    setIsLoading(false); // Сразу сбрасываем состояние загрузки
  }, []);

  return (
    <div>
      <label htmlFor="test-select">Выберите тест:</label>
      <select
        id="test-select"
        onChange={(e) => onSelect(e.target.value)}
        disabled={isLoading}
      >
        {isLoading ? (
          <option value="">Загрузка тестов...</option>
        ) : (
          tests.map(test => ( // Используем переданный список тестов (tests)
            <option key={test} value={test}>
              {test}
            </option>
          ))
        )}
      </select>

      <button onClick={onNext} disabled={isLoading}>
        Далее
      </button>
    </div>
  );
}

export default TestSelect;