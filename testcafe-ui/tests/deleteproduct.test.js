import { Selector } from 'testcafe';

const env = process.env.TESTCAFE_ENV || 'dev';
const config = require(`../config.${env}.js`);

fixture `Login Page`
    .page `${config.baseUrl}/#/login?logout=true`
    .beforeEach(async t => {
        await t.resizeWindow(1920, 1080);
    });
test('Test delete product', async t => {

    try {

        const emailInput = Selector('input[name="login"]');
        const passwordInput = Selector('input[name="password"]');
        const loginButton = Selector('button').withText('Вход');

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

        const Catalog = Selector('span').withText('Каталог');
        const Products = Selector('span').withText('Товары');
        const SelectCategory = Selector('#wrapper .multiselect__select').nth(0);
        const SetCategoryFilter = Selector('span').withText('AutoTest Category');
        const DelProduct = Selector('#wrapper i').withText('close').nth(0);
        const DelConfirm = Selector('button').withText('Да');

    await t
        .click(Catalog)
        .click(Products)
        .click(SelectCategory)
        .click(SetCategoryFilter)


    await t
        .expect(DelProduct.exists).ok('Delete button not found');

    await t.wait(1000)
        .click(DelProduct)
        .click(DelConfirm)

    await t
        .expect(DelProduct.exists).ok('Product was not deleted');

        console.log('Тест успешно пройден.');
    } catch (error) {
        console.error('Тест не пройден:', error);
        throw error;
    }

})