const { TypeError } = require("./Errors");

const haveKeys = obj => obj instanceof Object ? !!Object.keys(obj).length : false;
const haveValidValues = obj => obj instanceof Object ? !!Object.values(obj).filter(e => e).length : false;

const identifyMusicMetadata = (musicData, musicDataComp) => {
    if (!musicData || !musicDataComp) {
        return false;
    }

    const { details } = musicDataComp;

    let nameEquality = musicData.musicName === details.name;
    let authorEquality = musicData.musicAuthor === details.author;
    let playerEquality = musicData.musicPlayer === details.player.raw;

    return nameEquality && authorEquality && playerEquality;
}

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
    identifyMusicMetadata,
    resolveConfiguration,
    haveKeys,
    haveValidValues
}