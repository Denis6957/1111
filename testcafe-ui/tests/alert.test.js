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
            .expect(emailInput.exists).ok('Email input not found');
        console.log('Email input found.');

        await t.expect(passwordInput.exists).ok('Password input not found');
        console.log('Password input found.');

        await t.expect(loginButton.exists).ok('Login button not found');
        console.log('Login button found.');

        await t.wait(300)
            .typeText(emailInput, 'support-p400@m.ru')
            .typeText(passwordInput, 'qazQAZ')
            .click(loginButton);
        console.log('Logged in with provided credentials.');

        await t.wait(500)
            .expect(mainPageElement.exists).ok('Main page element not found after login');
        console.log('Main page element found after login.');

        const AccountSettings = Selector('#pagesExamples span').withText('Настройки кабинета');
        const Notifications = Selector('#idCabinetSettings span').withText('Оповещения');
        const Novokuznetsk = Selector('main i').withText('edit').nth(2);
        const TGIDOrder = Selector('#background .form-control').nth(2);
        const TGIDError = Selector('#background .form-control').nth(3);
        const Email = Selector('#background .form-control').nth(1);
        const NameManeger = Selector('#background .form-control').nth(0);

        await t.click(AccountSettings);
        console.log('Clicked on Account Settings.');

        await t.click(Notifications);
        console.log('Clicked on Notifications.');

        await t.click(Novokuznetsk);
        console.log('Clicked on Novokuznetsk edit.');

        const fields = [TGIDOrder, TGIDError, Email, NameManeger];
        const fieldValues = ['-0000000000000', '-0000000000000', 'email@email.com', 'Mr. eDA'];

        for (let i = 0; i < fields.length; i++) {
            const field = fields[i];
            const value = fieldValues[i];
            const currentValue = await field.value;

            if (currentValue !== '') {
                console.log(`Field ${i} is filled with: ${currentValue}`);
                await t.selectText(field).pressKey('delete');
                console.log(`Cleared field ${i}.`);
            }
            await t.typeText(field, value);
            console.log(`Filled field ${i} with value: ${value}.`);
        }

        const saveButton = Selector('#background a').withText('СОХРАНИТЬ');
        const successMessage = Selector('#wrapper span').withText('Успешное изменение');

        await t.click(saveButton)
            .expect(successMessage.exists).ok('Success message not found');
        console.log('Changes saved successfully.');

        await t.click(Novokuznetsk);
        console.log('Reopened the form to check saved data.');

        for (let i = 0; i < fields.length; i++) {
            const field = fields[i];
            const value = fieldValues[i];
            const currentValue = await field.value;

            await t.expect(currentValue).eql(value, `Field ${i} does not match the expected value`);
            console.log(`Field ${i} matches the expected value: ${value}.`);
        }

        console.log('Данные успешно сохранены и проверены.');

        for (let i = 0; i < fields.length; i++) {
            const field = fields[i];
            await t.selectText(field).pressKey('delete');
            console.log(`Cleared field ${i}.`);
        }

        await t.click(saveButton)
            .expect(successMessage.exists).ok('Success message not found');
        console.log('Changes saved successfully after clearing fields.');

        await t.click(Novokuznetsk);
        console.log('Reopened the form to check cleared fields.');

        for (let i = 0; i < fields.length; i++) {
            const field = fields[i];
            const currentValue = await field.value;

            await t.expect(currentValue).eql('', `Field ${i} is not empty after clearing`);
            console.log(`Field ${i} is empty as expected.`);
        }

        console.log('Поля успешно очищены и проверены.');
        console.log('Тест успешно пройден.');
    } catch (error) {
        console.error('Тест не пройден:', error);
        throw error;
    }
});
