const ConfigHandler = require('./ConfigHandler');
const TemplateEngine = require('./TemplateEngine');

let te = null;
const ch = new ConfigHandler();
ch.config['projectName'] = 'com.generated.app';
const template = {
    template: [
        '{{ imports }}',
        'class TestTemplate {',
        '{{ globals }}',
        'void test(){',
        '{{ module }}',
        '}',
        '{{ methods }}',
        '}',
        '{{ classes }}'
    ].join('\n'),
    layout: [
        '<Layout>',
        '{{ views }}',
        '</Layout>'
    ].join('\n'),
    manifest: [
        '<Manifest>',
        '{{ permissions }}',
        '{{ components }}',
        '</Manifest>'
    ].join('\n')
};

const module1 = {
    imports: ['import 1', '{{ imports }}'].join('\n'),
    globals: ['global 1', '{{ globals }}'].join('\n'),
    module: ['module 1', '{{ module }}'].join('\n'),
    methods: ['void method() {', '}', '{{ methods }}'].join('\n'),
    classes: ['class Class2 {', '}', '{{ classes }}'].join('\n'),
    views: ['<view1></view1>', '<view2></view2>', '{{ views }}'].join('\n'),
    permissions: ['<permission1></permission1>', '{{ permissions }}'].join('\n'),
    components: ['<comp1><Activity/></comp1>', '<comp2><Service/></comp2>', '{{ components }}'].join('\n')
};

const module2 = {
    imports: '{{ imports }}',
    globals: '{{ globals }}',
    module: [
        'statement1();',
        'statement2();',
        '{{ module }}'
    ].join('\n'),
    methods: '{{ methods }}',
    classes: '{{ classes }}'
};

describe('Testing correct insertion of the template engine', () => {
    beforeEach(() => {
        te = new TemplateEngine(template);
    });

    test('correct insertion into the source code placeholders', () => {
        const expectedResult = [
            'import 1',
            '{{ imports }}',
            'class TestTemplate {',
            'global 1',
            '{{ globals }}',
            'void test(){',
            'module 1',
            '{{ module }}',
            '}',
            'void method() {',
            '}',
            '{{ methods }}',
            '}',
            'class Class2 {',
            '}',
            '{{ classes }}'
        ].join('\n');

        te.insertModule(module1);
        const templateString = te.templateString;
        expect(templateString).toBe(expectedResult);
    });

    test('correct insertion into the views placeholders', () => {
        const expectedResult = [
            '<Layout>',
            '<view1></view1>',
            '<view2></view2>',
            '{{ views }}',
            '</Layout>'
        ].join('\n');

        te.insertModule(module1);
        const { layout } = te.getSourceContents();
        expect(layout).toBe(expectedResult);
    });

    test('correct insertion into the manifest placeholders', () => {
        const expectedResult = [
            '<Manifest>',
            '<permission1></permission1>',
            '{{ permissions }}',
            '<comp1><Activity/></comp1>',
            '<comp2><Service/></comp2>',
            '{{ components }}',
            '</Manifest>'
        ].join('\n');

        te.insertModule(module1);
        const { manifest } = te.getSourceContents();
        expect(manifest).toBe(expectedResult);
    });

    test('correct second insertion', () => {
        const expectedResult = [
            'import 1',
            '{{ imports }}',
            'class TestTemplate {',
            'global 1',
            '{{ globals }}',
            'void test(){',
            'module 1',
            'statement1();',
            'statement2();',
            '{{ module }}',
            '}',
            'void method() {',
            '}',
            '{{ methods }}',
            '}',
            'class Class2 {',
            '}',
            '{{ classes }}'
        ].join('\n');

        te.insertModule(module1);
        te.insertModule(module2);
        const templateString = te.templateString;
        expect(templateString).toBe(expectedResult);
    });
});

describe('Testing correct splitting and cleanup', () => {
    beforeEach(() => {
        te = new TemplateEngine(template);
    });

    test('Correct cleanup', () => {
        const expectedSourceResult = [
            'import 1',
            '',
            'class TestTemplate {',
            'global 1',
            '',
            'void test(){',
            'module 1',
            'statement1();',
            'statement2();',
            '',
            '}',
            'void method() {',
            '}',
            '',
            '}',
            'class Class2 {',
            '}',
            ''
        ].join('\n');

        const expectedLayoutResult = [
            '<Layout>',
            '<view1></view1>',
            '<view2></view2>',
            '',
            '</Layout>'
        ].join('\n');

        const expectedManifestResult = [
            '<Manifest>',
            '<permission1></permission1>',
            '',
            '<comp1><Activity/></comp1>',
            '<comp2><Service/></comp2>',
            '',
            '</Manifest>'
        ].join('\n');

        te.insertModule(module1);
        te.insertModule(module2);
        te._cleanTemplate();
        const { layout, manifest } = te.getSourceContents();
        const source = te.templateString;

        expect(source).toBe(expectedSourceResult);
        expect(layout).toBe(expectedLayoutResult);
        expect(manifest).toBe(expectedManifestResult);
    });

    test('Correct splitting of classes', () => {
        const expectedResult = [
            {
                className: 'TestTemplate',
                classContent: [
                    'package com.generated.app;',
                    '',
                    'import 1',
                    '',
                    'class TestTemplate {',
                    'global 1',
                    '',
                    'void test(){',
                    'module 1',
                    'statement1();',
                    'statement2();',
                    '',
                    '}',
                    'void method() {',
                    '}',
                    '',
                    '}'
                ].join('\n'),
            },
            {
                className: 'Class2',
                classContent: [
                    'package com.generated.app;',
                    '',
                    'import 1',
                    '',
                    'class Class2 {',
                    '}',
                    ''
                ].join('\n')
            }
        ];
        
        te.insertModule(module1);
        te.insertModule(module2);
        te._cleanTemplate();
        te._splitClasses();

        const { classes } = te.getSourceContents();
        expect(classes).toEqual(expectedResult);
    });
});

