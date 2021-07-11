class DuplicateFileError extends Error {
    duplicates = [];

    constructor(duplicates, message, ...args) {
        super(message, ...args);
        this.name = this.constructor.name;
        this.duplicates = duplicates;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = DuplicateFileError;