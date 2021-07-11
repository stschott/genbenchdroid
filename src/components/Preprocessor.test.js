const Preprocessor = require('./Preprocessor');

describe('Preprocessor module methods test', () => {
    const template = {
        className: 'MainActivity',
        methodSignature: 'void onCreate(android.os.Bundle)'
    };

    const pre = new Preprocessor(template);
});

describe('Preprocessor template methods test', () => {
    const template = {
        template: ['First line', 'Second line', 'Third line'],
        manifest: ['First line', 'Second line', 'Third line', 'Fourth line'],
        layout: ['First line', 'Second line'],
        className: 'MainActivity',
        methodSignature: 'void onCreate(android.os.Bundle)'
    };

    const afterPreprocessing = {
        template: 'First line\nSecond line\nThird line',
        manifest: 'First line\nSecond line\nThird line\nFourth line',
        layout: 'First line\nSecond line',
        className: 'MainActivity',
        methodSignature: 'void onCreate(android.os.Bundle)'
    };

    const pre = new Preprocessor(template);

    test('preprocessing of templates', () => {
        const processedTemplate = pre.preprocessTemplate(template);
        expect(processedTemplate).toEqual(afterPreprocessing);
    });
});

