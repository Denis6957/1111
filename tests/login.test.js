import { Selector } from 'testcafe';

const env = process.env.TESTCAFE_ENV || 'dev';
const config = require(`../config.${env}.js`);

fixture `Login Page`
    .page `${config.baseUrl}/#/login?logout=true`;

test('User can log in with valid credentials', async t => {
    // Selectors for login page
    const emailInput = Selector('input[name="login"]');
    const passwordInput = Selector('input[name="password"]');
    // Уточненный селектор для кнопки входа
    const loginButton = Selector('button').withText('Вход').withAttribute('type', 'button');

    // Selector for an element on the main page after login
    const mainPageElement = Selector('#wrapper'); // Update this selector if needed

    // Wait for login elements to appear
    await t
        .expect(emailInput.exists).ok('Email input not found')
        .expect(passwordInput.exists).ok('Password input not found')
        .expect(loginButton.exists).ok('Login button not found');

    // Perform login action
    await t
        .typeText(emailInput, 'admin')
        .typeText(passwordInput, 'pass1234');

    // Add a delay before clicking the login button
    await t.wait(4000); // Delay of 4000 milliseconds (4 seconds)

    // Click the login button
    await t
        .click(loginButton)
        .wait(2000);

    // Wait for main page element to appear
    await t
        .expect(mainPageElement.exists).ok('Main page element not found after login');

    // Optionally, add some more assertions or actions here, like checking user details on the main page
});
