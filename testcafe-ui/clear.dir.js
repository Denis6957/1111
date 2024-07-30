const fs = require('fs').promises;
const path = require('path');

async function findFiles(dir, fileName) {
    let results = [];
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            results = results.concat(await findFiles(fullPath, fileName));
        } else if (entry.name === fileName) {
            results.push(fullPath);
        }
    }
    
    return results;
}

async function deleteFiles() {
    console.log('Начало процесса удаления файлов...');

    const fileNameToDelete = 'funutai.png';
    const startDir = process.cwd();
    
    console.log('Ищем файлы:', fileNameToDelete);
    console.log('Начальная директория:', startDir);

    try {
        console.log('Начинаем поиск файлов...');
        const files = await findFiles(startDir, fileNameToDelete);
        console.log('Поиск файлов завершен. Найдено файлов:', files.length);

        if (files.length === 0) {
            console.log(`Файлы с именем ${fileNameToDelete} не найдены.`);
            return;
        }

        let deletedCount = 0;

        for (const file of files) {
            console.log('Удаляем файл:', file);
            try {
                await fs.unlink(file);
                console.log(`Файл ${file} успешно удален`);
                deletedCount++;
            } catch (err) {
                console.error(`Ошибка при удалении файла ${file}:`, err);
            }
        }

        console.log(`Всего обработано файлов: ${files.length}`);
        console.log(`Всего удалено файлов: ${deletedCount}`);
        console.log('Процесс удаления файлов завершен.');

    } catch (err) {
        console.error('Произошла ошибка:', err);
    }
}

async function main() {
    const exitTimeout = setTimeout(() => {
        console.log('Принудительное завершение процесса после таймаута.');
        process.exit(0);
    }, 60000);

    try {
        console.log('Запуск функции deleteFiles...');
        await deleteFiles();
        console.log('Функция deleteFiles завершена.');
    } catch (error) {
        console.error('Произошла ошибка при выполнении скрипта:', error);
    } finally {
        clearTimeout(exitTimeout);
        console.log('Очищен таймаут, завершаем процесс.');
        process.exit(0);
    }
}

console.log('Начало выполнения скрипта.');
main();