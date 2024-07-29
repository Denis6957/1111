import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { Selector } from 'testcafe';

const env = process.env.TESTCAFE_ENV || 'dev';
const config = require(`../config.${env}.js`);

const filePath = path.join(process.cwd(), 'funutai.png');
const fileUrl = 'https://drive.google.com/uc?export=download&id=1qSiwmkqB62PQU462-UJOlDBG1cENz6_n';

async function downloadFile(url, path) {
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'arraybuffer'
    });

    fs.writeFileSync(path, Buffer.from(response.data));
}

fixture `Login Page`
    .page `${config.baseUrl}/#/login?logout=true`
    .beforeEach(async t => {
        await t.resizeWindow(1920, 1080);

        if (!fs.existsSync(filePath)) {
            console.log('Файл не найден. Скачивание файла...');
            await downloadFile(fileUrl, filePath);
        } else {
            console.log('Файл уже существует.');
        }

        if (fs.existsSync(filePath)) {
            console.log('Файл успешно загружен:', filePath);
        } else {
            throw new Error('Не удалось скачать файл');
        }
    });

test('User can log in and add a product with a photo', async t => {
    try {
        const emailInput = Selector('input[name="login"]');
        const passwordInput = Selector('input[name="password"]');
        const loginButton = Selector('button').withText('Вход');

        const Catalog = Selector('span').withText('Каталог');
        const Products = Selector('span').withText('Товары');
        const addProductButton = Selector('button').withAttribute('class', "btn btn-primary add-button");
        const productNameInput = Selector('input.form-control').withAttribute('maxlength', '10000');
        const productDescriptionInput = Selector('textarea').withAttribute('placeholder', 'Введите описание товара');
        const Category = Selector('span').withText('Категория');
        const CategoryInCategory = Selector('span').withText('Блюда');
        const addPhotoProduct = Selector('label').withAttribute('for', "inputTag");
        const addPhoto = Selector('#background a').withText('ДОБАВИТЬ');
        const productImageInput = Selector('input[type="file"]');
        const productPriceInput = Selector('input.form-control').withAttribute('maxlength', '100');
        const saveProductButton = Selector('#wrapper a').withText('СОХРАНИТЬ').nth(1);
        const successMessage = Selector('#wrapper div').withText('×').nth(6);

        const mainPageElement = Selector('#wrapper');

        await t.wait(300)
            .expect(emailInput.exists).ok('Email input not found')
            .expect(passwordInput.exists).ok('Password input not found')
            .expect(loginButton.exists).ok('Login button not found');

        await t.wait(300)
            .typeText(emailInput, 'support-p400@m.ru')
            .typeText(passwordInput, 'qazQAZ')
            .click(loginButton);

        await t.wait(500)
            .expect(mainPageElement.exists).ok('Main page element not found after login');

        await t.wait(500)
            .click(Catalog)
            .click(Products)
            .click(addProductButton);

        await t.wait(1000)
            .expect(productNameInput.exists).ok('Product name input not found')
            .expect(productDescriptionInput.exists).ok('Product description input not found')
            .expect(productImageInput.exists).ok('Product image input not found')
            .expect(productPriceInput.exists).ok('Product price input not found');

        await t.wait(500)
            .typeText(productNameInput, 'Test Product')
            .typeText(productDescriptionInput, 'This is a test product description.')
            .typeText(productPriceInput, '100');

        await t.wait(300)
            .click(Category)
            .click(CategoryInCategory);

        await t.wait(1000)
            .setFilesToUpload(productImageInput, [filePath]);

        await t.wait(500)
            .click(addPhoto);

        await t.wait(700)
            .click(saveProductButton);

        await t.wait(200)
            .expect(successMessage.exists).ok('Success message not found');

        console.log('Тест успешно пройден.');
    } catch (error) {
        console.error('Тест не пройден:', error);
        throw error;
    }
});
