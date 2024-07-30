import React from 'react';

function BrowserSelect({ selectedBrowser, onSelect, onNext }) {
  return (
    <div>
      <label htmlFor="browser-select">Выберите браузер:</label>
      <select 
        id="browser-select"
        value={selectedBrowser} 
        onChange={(e) => onSelect(e.target.value)}
      >
        <option value="chrome">Chrome</option>
        <option value="firefox">Firefox</option>
        {/* Добавьте другие браузеры, если нужно */}
      </select>

      <button onClick={onNext}>Далее</button>
    </div>
  );
}

export default BrowserSelect;