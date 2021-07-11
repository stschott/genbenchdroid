const { spawn } = require('child_process');
const { resolve } = require('path');
const ConfigHandler = require('../components/ConfigHandler');

const runGradle = (successCallback) => {
    const jdkDir = new ConfigHandler().get('jdkDir');
    const gradle = spawn(process.platform === 'win32' ? 'gradlew.bat' : './gradlew', ['assembleDebug', `-Dorg.gradle.java.home=${jdkDir}`, '-q'], { cwd: 'generated' });

    // data handler
    gradle.stdout.on('data', data => console.log( `${data}` ) );
    // error handler
    gradle.stderr.on('data', data => console.log('\x1b[31m%s\x1b[0m', data ) );
    // finished handler
    gradle.on('close', code => {
        if (code === 0) {
            console.log('\x1b[33m%s\x1b[0m', 'Compilation process has been successfull');
            successCallback();
        } else {
            console.error('An error occured');
            console.log( `child process exited with code ${code}` );
        }
    });
};

const runNearleyc = async () => {
    const nearleycPath = resolve('node_modules/.bin/nearleyc');
    const nearleyc = spawn(nearleycPath, ['./grammar/grammar.ne', '-o', './grammar/grammar.js'], { shell: true });
    
    // error handler
    nearleyc.stderr.on( 'data', data => console.error('Error during grammar compilation: ' + data));
    // finished handler
    nearleyc.on( 'close', code => {
        if (code === 0) {
            console.log('Grammar has been successfully compiled');
        } else {
            console.error('Grammar could not be compiled');
        }
    });
};

module.exports = {
    runGradle,
    runNearleyc
};