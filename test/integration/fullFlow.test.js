const GBD = require('../../src/components/GBD');
const ConfigHandler = require('../../src/components/ConfigHandler');
const fs = require('fs').promises;
const dircompare = require('dir-compare');
const tmc1 = require('../TMCs/1/TMC');
const tmc2 = require('../TMCs/2/TMC');
const tmc3 = require('../TMCs/3/TMC');
const tmc4= require('../TMCs/4/TMC');

describe('Integration tests of GBDs manual mode', () => {
    const tmcs = [tmc1, tmc2, tmc3, tmc4];
    const dirsToCompare = [
        'app-config.txt', 
        'full-ground-truth.xml', 
        'ground-truth.xml', 
        'src/main/AndroidManifest.xml', 
        'src/main/res/layout', 
        'src/main/java'
    ];
    const createdFiles = [];

    afterAll(() => {
        createdFiles.forEach(file => {
            fs.rmdir(file, { recursive: true });
        });
    });
    
    test.skip('Compare all output files', async () => {
        const ch = new ConfigHandler();
        ch.init('config.json');
        const outputDir = ch.get('outputDir');
        for (const [idx, tmc] of tmcs.entries()) {
            const argv = {
                config: tmc.config,
                uncompiled: tmc.uncompiled,
                unobfuscated: tmc.unobfuscated
            };

            const gbd = new GBD(argv);

            const outputComparisonDir = `test/TMCs/${idx + 1}/test_output`;
            await gbd.run();
            const outputDirContent = await fs.readdir(outputDir);
            const outputDirContentSorted = outputDirContent.sort((a, b) => b - a);
            const createdDir = `${outputDir}/${outputDirContentSorted.pop()}`;
            createdFiles.push(createdDir);
            
            dirsToCompare.forEach(dir => {
                const dirComparisonResult = dircompare.compareSync(`${createdDir}/${dir}`, `${outputComparisonDir}/${dir}`, { compareContent: true });
                expect(dirComparisonResult.differences).toBe(0);
            });
        }
    });   
});
