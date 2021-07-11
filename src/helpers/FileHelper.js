const fs = require('fs');
const fse = require('fs-extra');
const crypto = require('crypto');
const path = require('path');
const { sync } = require('glob');
const FileNotFoundError = require('../components/Errors/FileNotFoundError');

const writeFileWithContent = (filePath, content) => {
    fse.ensureDirSync(path.dirname(filePath));
    fs.writeFileSync(filePath, content, 'utf8');
};

const readJson = filePath => {
    return fse.readJsonSync(filePath);
};

const cleanup = (filePath) => {
    try {
        fs.accessSync(filePath, fs.constants.F_OK);
        if (fs.lstatSync(filePath).isDirectory()) {
            fs.rmdirSync(filePath, { recursive: true });
        } else {
            fs.unlinkSync(filePath);
        }
    } catch {
        // if no file found deletion is not necessary
    }
};

const copyFile = (src, dest) => {
    fse.copySync(src, dest);
};

const hashFile = (path, hashName = 'md5') => {
    return new Promise((resolve, reject) => {
        const hash = crypto.createHash(hashName);
        const stream = fs.createReadStream(path);
        stream.on('error', err => reject(err));
        stream.on('data', chunk => hash.update(chunk));
        stream.on('end', () => resolve(hash.digest('hex')));
      });
};

const checkForFilenameDuplicates = (dir) => {
    if (!dir) return;

    const filesLookup = _readDirRecursively(dir);
    const duplicates = [];
    
    for (const [key, value] of Object.entries(filesLookup)) {
        if (Array.isArray(value) && value.length > 1) {
            duplicates.push(value);
        }
    }

    return duplicates;
};

const loadFileUsingGlob = (initialDir, fileName) => {
    const files = sync(`${initialDir}/**/${fileName}`);
    if (!Array.isArray(files) || !files.length) {
        throw new FileNotFoundError(`The file "${fileName}" in the initial directory "${initialDir}" could not be found`);
    }
    return files[0];
};

const _readDirRecursively = (dir, files = {}) => {
    if (!dir) return {};

    fs.readdirSync(dir).forEach(file => {
        const filePath = `${dir}/${file}`;
        if (fs.lstatSync(filePath).isDirectory()) {
            _readDirRecursively(filePath, files);
        } else {
            files[file] ? files[file].push(filePath) : files[file] = [filePath];
        }
    });
    
    return files;
};

module.exports = {
    cleanup,
    writeFileWithContent,
    copyFile,
    hashFile,
    checkForFilenameDuplicates,
    readJson,
    loadFileUsingGlob
};