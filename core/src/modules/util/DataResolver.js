const { TypeError } = require("./Errors");

const haveKeys = obj => obj instanceof Object ? !!Object.keys(obj).length : false;
const haveValidValues = obj => obj instanceof Object ? !!Object.values(obj).filter(e => e).length : false;

const resolveConfiguration = config => {
    if (!(config instanceof Object)) {
        throw new TypeError("Can not resolve non object configuration");
    }
    if (!config || !haveKeys(config)) return;
    if (!haveValidValues(config)) {
        throw new TypeError("Can not resolve invalid configuration");
    }

    return config;
}

module.exports = {
    resolveConfiguration,
    haveKeys,
    haveValidValues
}