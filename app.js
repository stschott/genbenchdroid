const GBD = require('./src/components/GBD');
const ConfigHandler = require('./src/components/ConfigHandler');
const { initCliOptions } = require('./src/helpers/CliOptionsHelper');
const { runNearleyc } = require('./src/helpers/ProcessHelper');

// Entry point of the application
const app = () => {
    // initialize command line options
    const argv = initCliOptions();
    // initialize user config
    new ConfigHandler().init('config.json');

    // if compilation flag is set, compile the grammar and stop script execution
    if (argv.compile) {
        runNearleyc();
        return;
    }

    const gbd = new GBD(argv);
    gbd.run();
}

app();
