const FlowProcessor = require('./FlowProcessor');
const tmc1 = require('../../test/TMCs/1/TMC');
const tmc2 = require('../../test/TMCs/2/TMC');
const tmc3 = require('../../test/TMCs/3/TMC');
const tmc4 = require('../../test/TMCs/4/TMC');

describe('Preprocessor ground-truth methods test', () => {
    const tmcs = [tmc1, tmc2, tmc3, tmc4];
    const template = {
        className: 'MainActivity',
        methodSignature: 'void onCreate(android.os.Bundle)'
    };
    const fp = new FlowProcessor(template);

    test(`Test flow processing (${tmcs.length} TMCs)`, () => {
        for (const tmc of tmcs) {
            const moduleTree = { ...tmc.afterPreprocessing };
            fp.processFlows(moduleTree); 
            expect(moduleTree).toEqual(tmc.afterFlowProcessing);
        }
    });
    
    test(`Test source sink connection generation (${tmcs.length} TMCs)`, () => {
        for (const tmc of tmcs) {
            expect(fp.getSourceSinkConnections(tmc.afterFlowProcessing)).toEqual(tmc.sourceSinkConnections);
        }
    });

    test(`Test all connection generation (${tmcs.length} TMCs)`, () => {
        for (const tmc of tmcs) {
            expect(fp.getAllConnections(tmc.afterFlowProcessing)).toEqual(tmc.allConnections);
        }
    });

});