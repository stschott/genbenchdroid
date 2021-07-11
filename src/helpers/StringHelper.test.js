const { genRandomString } = require('./StringHelper');

describe('Test of StringHelper functions', () => {
   
    test('Check random string length', () => {
        for (let i = 0; i <= 20; i++) {
            expect(genRandomString(i).length).toBe(i);
        }
    });

    test('Randomly generated string contains only uppercase and lowercase letters', () => {
        expect(genRandomString(20)).toMatch(/[a-z][A-Z]*/);
    });

});
