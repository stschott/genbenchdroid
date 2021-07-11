const { concatIfNotNull } = require('./ArrayHelper');

describe('Test of ArrayHelper functions', () => {

    test('concat "null" results in "[]"', () => {
       expect(concatIfNotNull(null)).toEqual([]); 
    });

    test('concat "[1, 2, 3]" results in "[1, 2, 3]"', () => {
       expect(concatIfNotNull([1, 2, 3])).toEqual([1, 2, 3]); 
    });

    test('concat "[1, 2, 3]" and "[4, 5, 6]" results in "[1, 2, 3, 4, 5, 6]"', () => {
       expect(concatIfNotNull([1, 2, 3], [4, 5, 6])).toEqual([1, 2, 3, 4, 5, 6]); 
    });

    test('concat "[1, 2]","[3, 4]" and "[5, 6]" results in "[1, 2, 3, 4, 5, 6]"', () => {
       expect(concatIfNotNull([1, 2], [3, 4], [5, 6])).toEqual([1, 2, 3, 4, 5, 6]); 
    });

    test('concat "[1, 2]","null" and "[5, 6]" results in "[1, 2, 5, 6]"', () => {
       expect(concatIfNotNull([1, 2], null, [5, 6])).toEqual([1, 2, 5, 6]); 
    });

});
