const concatIfNotNull = (...arrays) => {
    return [].concat(...arrays.filter(Array.isArray));
}

module.exports = {
    concatIfNotNull
};