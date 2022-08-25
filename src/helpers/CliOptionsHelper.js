const yargs = require('yargs/yargs');

const initCliOptions = () => {
    const argv = yargs(process.argv.slice(2))
        // --configuration, --config, --TMC, --tmc,  -c
        .usage('Usage: $0 -c [string]')
        .alias('c', 'config',)
        .alias('c', 'configuration')
        .alias('c', 'TMC')
        .alias('c', 'tmc')
        .describe('c', 'Provide the benchmark case configuration')
        .example('$0 -c "BasicTemplate ImeiSource SmsSink"', 'Creates a simple benchmark case')

        // --compile
        .usage('Usage: $0 --compile [boolean]')
        .describe('compile', 'Recompile the modified grammar')
        .example('$0 --compile', 'Compiles the grammar.ne file')

        // --fuzz, -f
        .usage('Usage: $0 --fuzz [boolean]')
        .describe('fuzz', 'Generate a random benchmark case')
        .example('$0 --fuzz', 'Generates an application with a random template/modules configuration')
        .alias('fuzz', 'f')

        // --maxLength, --max
        .usage('Usage: $0 --maxLength [int]')
        .describe('maxLength', 'Specifies maximum amount of modules in the generated configuration')
        .example('$0 --fuzz --maxLength 10', 'Generates an application containing at most 10 modules')
        .alias('maxLength', 'max')
        .default('maxLength', 25)

        // --minLenght, --min
        .usage('Usage: $0 --minLength [int]')
        .describe('minLength', 'Specifies minimum amount of modules in the generated configuration')
        .example('$0 --fuzz --maxLength 10 --minLength 5', 'Generates an application containing at most 10 and at least 5 modules')
        .alias('minLength', 'min')
        .default('minLength', 1)

        // --taintflow, -t
        .usage('Usage: $0 --taintflow [boolean]')
        .describe('taintflow', 'Guarantees that there is at least one taint flow inside the generated application')
        .example('$0 --fuzz --taintflow', 'Generates an application that has at least one taint flow inside it')
        .alias('taintflow', 't')

        // --contains
        .array('contains')
        .usage('Usage: $0 --contains [array]')
        .describe('contains', 'Guarantees that there is at least one module for every specified string')
        .example('$0 --fuzz --contains ImeiSource reflective', 'Generates an application that contains at least one ImeiSource and one module that has "reflective" in its name')

        // --ignore
        .array('ignore')
        .usage('Usage: $0 --ignore [array]')
        .describe('ignore', 'Guarantees that there is no module containing the provided arguments in its name')
        .example('$0 --fuzz --ignore ImeiSource reflective', 'Generates an application that does not contain an ImeiSource and no module that has "reflective" in its name')

        // --priority, --priorities, --prioritize, --prio, -p
        .array('priority')
        .usage('Usage: $0 --priority [array]')
        .describe('priority', 'Gives the specified modules a higher priority')
        .example('$0 --fuzz --priority ImeiSource 5 reflective 20', 'During the selection of random modules the ImeiSource modules has a 5 times higher chance to be selected than the other modules. \
                    Every module that has "reflective" in its name has a 20 times higher chance to be selected')
        .alias('priority', 'prioritize')
        .alias('priority', 'priorities')
        .alias('priority', 'prio')
        .alias('priority', 'p')
        
        // --uncompiled
        .usage('Usage: $0 --uncompiled [boolean]')
        .describe('uncompiled', 'Instead of generating an APK-file, the uncompiled source-code is served as output')
        .example('$0 --fuzz --uncompiled', 'Generates the uncompiled source-code for a random application')

        // --unobfuscated, -u
        .usage('Usage: $0 --unobfuscated [boolean]')
        .describe('unobfuscated', 'The variable containing the sensitive data will not be obfuscated')
        .example('$0 --fuzz --unobfuscated', 'Generates a random application with an unobfuscated variable containing the sensitive data')
        .alias('unobfuscated', 'u')

        // --directOutput, -d
        .usage('Usage: $0 --directOutput [boolean]')
        .describe('directOutput', 'Outputs the generated files directly in the output directory (Overwrittes previous with this option generated files)')
        .example('$0 --fuzz --directOutput', 'Generates an application and places all its files directly in the output directory')
        .alias('directOutput', 'd')

        .argv;
    return argv;
};

module.exports = {
    initCliOptions
};