import { Selector } from 'testcafe';

const env = process.env.TESTCAFE_ENV || 'dev';
const config = require(`../config.${env}.js`);

fixture `Login Page`
    .page `${config.baseUrl}/#/login?logout=true`
    .beforeEach(async t => {
        await t.resizeWindow(1920, 1080);
    });
test('Test registration user on eDA-platform', async t => {
//Set registration info
    const inputNameCompany = Selector('input[name= "NameCompany"]');
    const inputCityCompany = Selector('input[name= "CityCompany"]');
    const inputINN = Selector('input[name= "INN"]');
    const inputCEO = Selector('input[name= "CEO"]');
    const inputContactFace = Selector('input[name= "ContactFace"]');
    const inputPhoneNumber = Selector('input[name= "PhoneNumber"]');
    const inputEmail = Selector('input').nth(6);
    const CheckBoxNewLeed = Selector('span').withAttribute('class', "check");
    const RegButton = Selector('button').withAttribute('type', "button");

// Set const succes registration
    const Succes = Selector('alert-succes');

await t 
    .expect(inputNameCompany.exists).ok('No elements on page');

// Write registration data
    typeText(inputNameCompany, 'New Company')
    typeText(inputCityCompany, 'Novokuznetsk')
    typeText(inputINN, '11111111')
    typeText(inputCEO, 'Ivanov Ivan Ivanovich')
    typeText(inputContactFace, 'Demidov Dmitry Dmitrievich')
    typeText(inputPhoneNumber, '79999999999')
    typeText(inputEmail, 'email@email.com')
// Add a delay before clicking the login button
await t.wait(1000);

// Click on register button
await t
    .click(CheckBoxNewLeed);
    click(RegButton);

// Check succes registration
await t
    .expect(Succes.exists).ok('Successful registration message not found');
})
