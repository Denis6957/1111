import { Selector } from 'testcafe';

const env = process.env.TESTCAFE_ENV || 'dev';
const config = require(`../config.${env}.js`);

fixture `Login Page`
    .page `${config.baseUrl}/#/login?logout=true`
    .beforeEach(async t => {
        await t.resizeWindow(1920, 1080);
    });
    test('Test registration user on eDA-platform', async t => {
        const emailInput = Selector('input[name="login"]');
        const passwordInput = Selector('input[name="password"]');
        const loginButton = Selector('button').withText('Вход').withAttribute('type', 'button');

    await t
        .typeText(emailInput, 'support-p400@m.ru')
        .typeText(passwordInput, 'qazQAZ');

    await t
        .click(loginButton)

    await t.debug();
    });