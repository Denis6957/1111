import { Selector } from 'testcafe';

const env = process.env.TESTCAFE_ENV || 'dev';
const config = require(`../config.${env}.js`);

fixture `Login Page`
    .page `${config.baseUrl}/#/login?logout=true`
    .beforeEach(async t => {
        await t.resizeWindow(1920, 1080);
    });
test('Test delete product', async t => {

// Selectors for login page
        const emailInput = Selector('input[name="login"]');
        const passwordInput = Selector('input[name="password"]');
        const loginButton = Selector('button').withText('Вход');

// Selector for an element on the main page after login
        const mainPageElement = Selector('#wrapper');    

// Wait for login elements to appear
    await t.wait(300)
        .expect(emailInput.exists).ok('Email input not found')
        .expect(passwordInput.exists).ok('Password input not found')
        .expect(loginButton.exists).ok('Login button not found'); 

// Perform login action
    await t.wait(300)
        .typeText(emailInput, 'support-p400@m.ru')
        .typeText(passwordInput, 'qazQAZ')
        .click(loginButton);

// Wait for main page element to appear
    await t.wait(500)
        .expect(mainPageElement.exists).ok('Main page element not found after login');

// Select section category
        const Catalog = Selector('span').withText('Каталог');
        const Products = Selector('span').withText('Товары');
        const SelectCategory = Selector('#wrapper .multiselect__select').nth(0);
        const SetCategoryFilter = Selector('span').withText('AutoTest Category');
        const DelProduct = Selector('#wrapper i').withText('close').nth(0);
    
// Click on the navigatoin button
    await t
        .click(Catalog)
        .click(Products)
        .click(SelectCategory)
        .click(SetCategoryFilter)

// Wait elements delete on category page
    await t
        .expect(DelProduct.exists).ok('Delete button not found');

    await t.wait(1000)
        .click(DelProduct)

// Check del button on page
    await t
        .expect(DelProduct.exists).ok('Product was not deleted');


})