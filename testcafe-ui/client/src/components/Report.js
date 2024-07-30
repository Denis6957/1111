import React from 'react';

    function Report({ report, error }) {
      if (error) {
        return <div className="error">Ошибка: {error}</div>; 
      }

      if (!report) {
        return null;
      }

      return (
        <div className="report">
          <h2>Отчёт о тестировании</h2>

          <table>
            <thead>
              <tr>
                <th>Название теста</th>
                <th>Статус</th>
                <th>Время выполнения</th>
              </tr>
            </thead>
            <tbody>
              {report.fixtures.map(fixture =>
                fixture.tests.map(test => (
                  <tr key={test.name}>
                    <td>{`${fixture.name} - ${test.name}`}</td>
                    <td
                      className={test.errs.length > 0 ? 'failed' : 'passed'}
                    >
                      {test.errs.length > 0 ? 'Провал' : 'Успешно'}
                    </td>
                    <td>{test.durationMs / 1000} сек</td> 
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      );
    }

    export default Report;