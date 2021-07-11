const Fuzzer = require('./Fuzzer');
const tmc1 = require('../../test/TMCs/1/TMC');
const tmc2 = require('../../test/TMCs/2/TMC');
const tmc3 = require('../../test/TMCs/3/TMC');
const tmc4 = require('../../test/TMCs/4/TMC');

let testGrammarPath = '../../test/testGrammar/grammar';

describe('Testing the verify functionality of the Fuzzer', () => {
    let fuzzer = null;

    test('Correct TMCs', () => {
        const tmcs = [tmc1, tmc2, tmc3, tmc4];
        for (const tmc of tmcs) { 
            fuzzer = new Fuzzer(testGrammarPath);
            const verificationResult = fuzzer.verify(tmc.config);
            expect(verificationResult).toBe(true);
        }
    });

    test('Incorrect TMCs', () => {
        const itmc1 = 'ImeiSource SmsSink';
        const itmc2 = 'BasicTemplate ImeiSource ( ) ( )';
        const itmc3 = 'BasicTemplate RandomIfElseBridge ( LogSink )';
        const itmc4 = 'asicTemplate ImeiSource';
        const tmcs = [itmc1, itmc2, itmc3, itmc4];
        for (const tmc of tmcs) { 
            fuzzer = new Fuzzer(testGrammarPath);
            const verificationResult = fuzzer.verify(tmc.config);
            expect(verificationResult).toBe(false);
        }
    });
});

describe('Testing the fuzzing functionality of the Fuzzer', () => {
    let fuzzer = new Fuzzer(testGrammarPath);

    describe('Min and max length parameter tests', () => {

        test('Default parameters', () => {
            for (let i = 0; i <= 500; i++) {
                const tmc = fuzzer.fuzz();
                const filteredTmc = _filterTmc(tmc).split(' ').slice(1);
                expect(filteredTmc.length).toBeLessThanOrEqual(25);
                expect(filteredTmc.length).toBeGreaterThanOrEqual(0);
            }
        });

        test('Min length', () => {
            for (let i = 0; i <= 500; i++) {
                const tmc = fuzzer.fuzz({ minLength: 10 });
                const filteredTmc = _filterTmc(tmc).split(' ').slice(1);
                expect(filteredTmc.length).toBeGreaterThanOrEqual(10);
            }
        });

        test('Max length', () => {
            for (let i = 0; i <= 500; i++) {
                const tmc = fuzzer.fuzz({ maxLength: 10 });
                const filteredTmc = _filterTmc(tmc).split(' ').slice(1);
                expect(filteredTmc.length).toBeLessThanOrEqual(10);
            }
        });

        test('Min and max length combined', () => {
            for (let i = 0; i <= 500; i++) {
                const tmc = fuzzer.fuzz({ maxLength: 15, minLength: 10 });
                const filteredTmc = _filterTmc(tmc).split(' ').slice(1);
                expect(filteredTmc.length).toBeLessThanOrEqual(15);
                expect(filteredTmc.length).toBeGreaterThanOrEqual(10);
            }
        });

    });

    describe('Testing the ignore and contains parameters', () => {
        const testModules = ['ImeiSource', 'RandomIfElseBridge', 'OnStartTemplate'];

        test('Contains', () => {
            for (let i = 0; i <= 500; i++) {
                const tmc = fuzzer.fuzz({ contains: testModules });
                if (!tmc) return;

                testModules.forEach(module => {
                    expect(_filterTmc(tmc).split(' ')).toContain(module);
                });
            }
        });

        test('Ignore', () => {
            for (let i = 0; i <= 500; i++) {
                const tmc = fuzzer.fuzz({ ignore: testModules });
                if (!tmc) return;

                testModules.forEach(module => {
                    expect(_filterTmc(tmc).split(' ')).not.toContain(module);
                });
            }
        });

        test('Ignore and Contains', () => {
            for (let i = 0; i <= 500; i++) {
                const tmc = fuzzer.fuzz({ contains: testModules, ignore: ['SmsSink'] });
                if (!tmc) return;

                testModules.forEach(module => {
                    expect(_filterTmc(tmc).split(' ')).toContain(module);
                    expect(_filterTmc(tmc).split(' ')).not.toContain('SmsSink');
                });
            }
        });

    });
});

const _filterTmc = tmc => {
    return tmc
        .replace(/\(/g, '')
        .replace(/\)/g, '')
        .replace(/\s\s+/g, ' ')
        .trim();
};