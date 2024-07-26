import { Selector } from 'testcafe';

const env = process.env.TESTCAFE_ENV || 'dev';
const config = require(`../config.${env}.js`);

fixture `Login Page`
    .page `${config.baseUrl}/#/login?logout=true`
    .beforeEach(async t => {
        await t.resizeWindow(1920, 1080);
    });
test('User can log in and add a product with a photo', async t => {
    // Selectors for login page
    const emailInput = Selector('input[name="login"]');
    const passwordInput = Selector('input[name="password"]');
    const loginButton = Selector('button').withText('Вход');

    // Selectors for adding product
    const Catalog = Selector('span').withText('Каталог');
    const Products = Selector('span').withText('Товары');
    const addProductButton = Selector('button').withAttribute('class', "btn btn-primary add-button");
    const productNameInput = Selector('input.form-control').withAttribute('maxlength', '10000');
    const productDescriptionInput = Selector('textarea').withAttribute('placeholder', 'Введите описание товара');
    const Category = Selector('span').withText('Категория')
    const CategoryInCategory = Selector('span').withText('Блюда')
    const addPhotoProduct = Selector('label').withAttribute('for', "inputTag");
    const addPhoto = Selector('#background a').withText('ДОБАВИТЬ');
    const productImageInput = Selector('input[type="file"]');
    const productPriceInput = Selector('input.form-control').withAttribute('maxlength', '100');
    const saveProductButton = Selector('#wrapper a').withText('СОХРАНИТЬ').nth(1);
    const successMessage = Selector('#wrapper div').withText('×').nth(6);

    // Path to the image file
    const filePath = 'C:\\Users\\Professional\\Downloads\\Огурцы.png';

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

    // Click on add product button
    await t.wait(500)
        .click(Catalog)
        .click(Products)
        .click(addProductButton)

    // Wait for add product elements to appear
    await t.wait(1000)
        .expect(productNameInput.exists).ok('Product name input not found')
        .expect(productDescriptionInput.exists).ok('Product description input not found')
        .expect(productImageInput.exists).ok('Product image input not found')
        .expect(productPriceInput.exists).ok('Product price input not found');

    // Fill in product details and upload photo
    await t.wait(500)
        .typeText(productNameInput, 'Test Product')
        .typeText(productDescriptionInput, 'This is a test product description.')
        .typeText(productPriceInput, '100')

    // Change category product
    await t.wait(300)
        .click(Category)
        .click(CategoryInCategory)

    // Set image
        .setFilesToUpload(productImageInput, [filePath]);

    // Add image
    await t.wait(500)
        .click(addPhoto);      

    // Save the product
    await t.wait(700)
        .click(saveProductButton);

    // Add assertions to verify product was added successfully
    await t.expect(successMessage.exists).ok('Success message not found');
});