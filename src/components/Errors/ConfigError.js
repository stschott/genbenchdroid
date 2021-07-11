class ConfigError extends Error {
    constructor(message, ...args) {
        super(message, ...args);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = ConfigError;