const Fuzzer = require('./Fuzzer');
const Preprocessor = require('./Preprocessor');
const FlowProcessor = require('./FlowProcessor');
const TemplateEngine = require('./TemplateEngine');
const FileGenerator = require('./FileGenerator');
const ConfigHandler = require('./ConfigHandler');
const ErrorHandler = require('./Errors/ErrorHandler');
const DuplicateFileError = require('./Errors/DuplicateFileError');
const ConfigError = require('./Errors/ConfigError');
const { readJson, checkForFilenameDuplicates, loadFileUsingGlob } = require('../helpers/FileHelper');
const { parseTree, BFS } = require('../helpers/TreeHelper');
const { runGradle } = require('../helpers/ProcessHelper');

class GBD {
    argv = {};

    constructor(argv) {
        this.argv = argv;
    }

    async run() {
        try {
            this._duplicateFileCheck();
            
            // get TMC
            const fuzzer = new Fuzzer('../../grammar/grammar');
            const { tmc, tmcString } = this._getTMC(this.argv, fuzzer);
            
            // load template from TMC
            const templateName = tmc.shift();
            const template = this._loadTemplate(templateName);
            
            // initialize preprocessor and preprocess template
            const pre = new Preprocessor();
            const processedTemplate = pre.preprocessTemplate(template, this.argv.unobfuscated);
            
            // initialize template engine
            const te = new TemplateEngine(processedTemplate);
            
            // parse, load and preprocess modules from TMC
            const moduleTree = parseTree(tmc);
            BFS(moduleTree, (module, id) => this._processModule(pre, te, this.argv.unobfuscated, module, id));
            
            // process and generate taint flows for ground-truth
            const fp = new FlowProcessor(processedTemplate);
            fp.processFlows(moduleTree);
            const sourceSinkConnections = fp.getSourceSinkConnections(moduleTree);
            const allConnections = fp.getAllConnections(moduleTree);

            // finish source generation and obtain source contents before writting to file
            te.finishSourceGeneration();
            const { manifest, layout, classes } = te.getSourceContents();
            const linenumberLookup = te.createLinenumberLookup();

            // generate the source files
            const fg = new FileGenerator(manifest, layout, classes, tmcString);
            fg.generateSourceFiles();
            this._log('Source-code generation complete');

            // check for uncompiled flag and either compile or just move source files
            const successCb = () => this._log('Benchmark case has been successfully generated');
            await this._finishGeneration(this.argv.uncompiled, () => fg.finishCompilation(sourceSinkConnections, allConnections, linenumberLookup, this.argv.uncompiled, successCb));  
        } catch (err) {
            const errorHandler = new ErrorHandler();
            errorHandler.handleError(err);
        }
    }

    // check for duplicate file names
    _duplicateFileCheck() {
        const moduleDir = new ConfigHandler().get('moduleDir');
        const duplicates = checkForFilenameDuplicates(moduleDir);
        if (duplicates?.length) {
            throw new DuplicateFileError(duplicates, 'Multiple Files have the same file name');
        }
    }

    // parse or generate TMC tree
    _getTMC(argv, fuzzer) {
        const { config, fuzz, maxLength, minLength, taintflow, contains, ignore, priority } = argv;
        let tmcString;
        if (!config && !fuzz) {
            throw new ConfigError('You either have to provide a template/modules configuration or activate the fuzzing mode');
        }

        if (config) {
            // format the config string
            tmcString = config.trim().replace(/\s\s+/g, ' ');
            // verify the configString
            if (!fuzzer.verify(tmcString)) {
                // invalid configuration
                throw new ConfigError('Invalid Template/Module Configuration (TMC) provided');
            }
        } else if (fuzz) {
            tmcString = fuzzer.fuzz({ maxLength, minLength, taintflow, contains, ignore, priority });
            if (!tmcString) {
                throw new ConfigError('Could not generate a proper Template/Modules Configuration (TMC)');
            }
            this._log('Generated Template/Module Configuration (TMC):', `--- ${tmcString} ---`);
        }

        const tmc = tmcString.split(/\s+|(\(|\))/g).filter(elem => elem);
        return { tmc, tmcString };
    }

    // load template data from corresponding file
    _loadTemplate(templateName) {
        const templateDir = new ConfigHandler().get('templateDir');
        const templateFile = loadFileUsingGlob(templateDir, `${templateName}.json`);
        const template = readJson(templateFile);
        return template;
    }

    // process each module one by one
    // 1. load module
    // 2. preprocess module
    // 3. insert module into template
    _processModule(pre, te, unobfuscated = false, module, id) {
        const moduleName = module.module;
        if (!module || !moduleName || moduleName === 'empty') return;

        // use glob to load the module from arbitrary subdir inside module dir
        const moduleDir = new ConfigHandler().get('moduleDir');
        const moduleFile = loadFileUsingGlob(moduleDir, `${moduleName}.json`);
        const moduleData = readJson(moduleFile);
        module.type = moduleData.type;
        module.flows = moduleData.flows;
        module.id = id;
        module.children.forEach((child, idx) => {
            child.parentId = id;
            child.childId = idx;
        });

        const processedModule = pre.preprocessModule(moduleData, module.parentId, module.childId, module.id, unobfuscated);
        te.insertModule(processedModule);
    }

    // run gradle to compile and generate the ground-truth if successfull
    _finishGeneration(uncompiled, finishFunction) {
        return new Promise((resolve, reject) => {
            if (uncompiled) {
                finishFunction();
                resolve();
            } else {
                this._log('Starting compilation process');
                runGradle(() => finishFunction());
                resolve();
            }
        });
    }

    _log(...args) {
        args.forEach(string => {
            console.log('\x1b[33m%s\x1b[0m', string);
        });
    }
};

module.exports = GBD;