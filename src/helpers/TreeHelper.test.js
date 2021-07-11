const { parseTree, BFS } = require('./TreeHelper');

describe('Test of TreeHelper parseTree function', () => {

    test('Parsing of linear string (cut of the template)', () => {
        expect(parseTree(['Module1', 'Module2', 'Module3', 'Module4'])).toEqual({
            module: 'Module1',
            children: [
                {
                    module: 'Module2',
                    children: [
                        { 
                            module: 'Module3',
                            children: [
                                { 
                                    module: 'Module4',
                                    children: []
                                }
                            ]
                        }
                    ]
                }
            ]
        });
    });

    test('Parsing of 2 branched string', () => {
        expect(parseTree(['Module1', 'Module2', '(', 'Module3', ')', '(', 'Module4', ')'])).toEqual({
            module: 'Module1',
            children: [
                {
                    module: 'Module2',
                    children: [
                        { 
                            module: 'Module3',
                            children: []
                        },
                        { 
                            module: 'Module4',
                            children: []
                        }
                    ]
                }
            ]
        });
    });

    test('Parsing of 3 branched string', () => {
        expect(parseTree(['Module1', 'Module2', '(', 'Module3', ')', '(', 'Module4', ')', '(', 'Module5', ')'])).toEqual({
            module: 'Module1',
            children: [
                {
                    module: 'Module2',
                    children: [
                        { 
                            module: 'Module3',
                            children: []
                        },
                        { 
                            module: 'Module4',
                            children: []
                        },
                        { 
                            module: 'Module5',
                            children: []
                        }
                    ]
                }
            ]
        });
    });

    test('Parsing of 2 branched string (Instant branch)', () => {
        expect(parseTree(['Module1', '(', 'Module2', 'Module5', ')', '(', 'Module3', 'Module4', ')'])).toEqual({
            module: 'Module1',
            children: [
                {
                    module: 'Module2',
                    children: [
                        { 
                            module: 'Module5',
                            children: []
                        }
                    ]
                },
                { 
                    module: 'Module3',
                    children: [
                        { 
                            module: 'Module4',
                            children: []
                        }
                    ]
                }
            ]
        });
    });

    test('Parsing of 2 nested branched string (1. branch)', () => {
        expect(parseTree(['Module1', 'Module2', '(', 'Module3', '(', 'NestedModule1', ')', '(', 'NestedModule2', ')', ')', '(', 'Module4', ')'])).toEqual({
            module: 'Module1',
            children: [
                {
                    module: 'Module2',
                    children: [
                        { 
                            module: 'Module3',
                            children: [
                                { 
                                    module: 'NestedModule1',
                                    children: []
                                },
                                { 
                                    module: 'NestedModule2',
                                    children: []
                                },
                            ]
                        },
                        { 
                            module: 'Module4',
                            children: []
                        }
                    ]
                }
            ]
        });
    });

    test('Parsing of 2 nested branched string (2. branch)', () => {
        expect(parseTree(['Module1', 'Module2', '(', 'Module3', ')', '(', 'Module4', '(', 'NestedModule1', ')', '(', 'NestedModule2', ')', ')'])).toEqual({
            module: 'Module1',
            children: [
                {
                    module: 'Module2',
                    children: [
                        { 
                            module: 'Module3',
                            children: []
                        },
                        { 
                            module: 'Module4',
                            children: [
                                { 
                                    module: 'NestedModule1',
                                    children: []
                                },
                                { 
                                    module: 'NestedModule2',
                                    children: []
                                },
                            ]
                        }
                    ]
                }
            ]
        });
    });

    test('Parsing of empty branches (both)', () => {
        expect(parseTree(['Module1', '(', ')', '(', ')'])).toEqual({
            module: 'Module1',
            children: [
                {
                    module: 'empty',
                    children: []
                },
                {
                    module: 'empty',
                    children: []
                },
            ]
        });
    });

    test('Parsing of 3 empty branches', () => {
        expect(parseTree(['Module1', '(', ')', '(', ')', '(', ')'])).toEqual({
            module: 'Module1',
            children: [
                {
                    module: 'empty',
                    children: []
                },
                {
                    module: 'empty',
                    children: []
                },
                {
                    module: 'empty',
                    children: []
                },
            ]
        });
    });

    test('Parsing of one empty branch and one filled branch', () => {
        expect(parseTree(['Module1', '(', ')', '(', 'Module2', ')'])).toEqual({
            module: 'Module1',
            children: [
                {
                    module: 'empty',
                    children: []
                },
                {
                    module: 'Module2',
                    children: []
                }
            ]
        });
    });

});

describe('Test of BFS function', () => {

    test('Correct order of execution', () => {
        const tree = {
            module: 'Module1',
            children: [
                {
                    module: 'Module2',
                    children: [
                        { 
                            module: 'Module3',
                            children: [
                                { 
                                    module: 'NestedModule1',
                                    children: []
                                },
                                { 
                                    module: 'NestedModule2',
                                    children: []
                                },
                                { 
                                    module: 'NestedModule3',
                                    children: []
                                },
                            ]
                        },
                        { 
                            module: 'Module4',
                            children: []
                        }
                    ]
                },
                {
                    module: 'FirstNestedModule1',
                    children: [
                        {
                            module: 'FirstNestedModule2',
                            children: [],
                        }
                    ],
                }
            ]
        };

        const mockCb = jest.fn((module, count) => ({ module: module.module, count }));
        BFS(tree, mockCb);
        expect(mockCb.mock.calls.length).toBe(9);
        expect(mockCb.mock.results[0].value).toEqual({ module: 'Module1', count: 0 });
        expect(mockCb.mock.results[1].value).toEqual({ module: 'Module2', count: 1 });
        expect(mockCb.mock.results[2].value).toEqual({ module: 'FirstNestedModule1', count: 2 });
        expect(mockCb.mock.results[3].value).toEqual({ module: 'Module3', count: 3 });
        expect(mockCb.mock.results[4].value).toEqual({ module: 'Module4', count: 4 });
        expect(mockCb.mock.results[5].value).toEqual({ module: 'FirstNestedModule2', count: 5 });
        expect(mockCb.mock.results[6].value).toEqual({ module: 'NestedModule1', count: 6 });
        expect(mockCb.mock.results[7].value).toEqual({ module: 'NestedModule2', count: 7 });
        expect(mockCb.mock.results[8].value).toEqual({ module: 'NestedModule3', count: 8 });
    });
});