
const fs = require('fs');
const { execSync } = require('child_process');

const packageJson = {
  "name": "testcafe-project",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "cleanup": "cross-env NODE_ENV=test node clear.dir.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "cross-env": "^7.0.3",
    "testcafe": "^3.6.2"
  },
  "dependencies": {
    "axios": "^1.7.2",
    "chalk": "^5.3.0",
    "glob": "^11.0.0"
  }
};

function updatePackageJson() {
  fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
  console.log('Файл package.json обновлен.');
}

function installPackage(packageName) {
  try {
    console.log(`Установка ${packageName}...`);
    execSync(`npm install ${packageName}`, { stdio: 'inherit' });
    console.log(`${packageName} установлено успешно.`);
  } catch (error) {
    console.error(`Ошибка при установке ${packageName}:`, error);
  }
}

function installAllPackages() {
  console.log('Повторная установка зависимостей проекта...');
  try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('Зависимости проекта установлены успешно.');
  } catch (error) {
    console.error('Ошибка при установке зависимостей проекта:', error);
  }

  const packages = ['axios', 'glob', 'chalk', 'cross-env'];

  packages.forEach(packageName => installPackage(packageName));
}

updatePackageJson();
installAllPackages();
