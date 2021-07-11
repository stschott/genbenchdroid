const ConfigError = require("./ConfigError");
const DuplicateFileError = require("./DuplicateFileError");

class ErrorHandler {

    handleError(error) {

        switch (error.constructor) {
            case DuplicateFileError:
                this._logDuplicateFiles(error.duplicates);
                break;
            case ConfigError:
                this._logErrorMessage(error.name, error.message);
                this._logHelp();
                break;
            default:
                this._logErrorStack(error.stack);
        }
    }

    _logErrorMessage(name, message) {
        console.log(`${name}:`, message);
    }

    _logErrorStack(stack) {
        console.error('\x1b[31m%s\x1b[0m', 'An error has occured:');
        console.error('\x1b[31m%s\x1b[0m', stack);
    }

    _logDuplicateFiles(duplicates) {
        console.log('\nThe following files have the same file name:');
        console.log('----------------------------------');
        duplicates.forEach((duplicate, idx) => {
            if (idx > 0) {
                console.log('----------------------------------');
            }
            duplicate.forEach(file => {
                console.log(file);
            });
        });
        console.log('----------------------------------');
        console.log('Please resolve the file name conflict and execute GenBenchDroid again.');
    }

    _logHelp() {
        console.log('Use the parameter --help for further information');
    }
}

module.exports = ErrorHandler;