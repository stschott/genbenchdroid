const { readJson } = require('../helpers/FileHelper');

class ConfigHandler {
    config = {};

    constructor() {
        if (ConfigHandler._instance) {
            return ConfigHandler._instance;
        }
        ConfigHandler._instance = this;
    }

    init(fileName) {
        const readConfig = readJson(fileName);
        this.config = {
            ...this.config,
            ...readConfig
        };
    }

    get(prop) {
        if (typeof prop !== 'string') return;

        return this.config[prop];
    }
}

module.exports = ConfigHandler;