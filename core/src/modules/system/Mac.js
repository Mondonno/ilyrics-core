const IScripts = require("../helpers/IAppleScript");
const MakeQuick = require("../helpers/QuickResolver");

const { appleScripts } = require("../Configuration");

const musicPlayerPath = `${appleScripts}/checkPlayer.applescript`;
const musicGetterPath = `${appleScripts}/getMusic.applescript`;

const isArray = obj => obj instanceof Array;
const isEmptyString = obj => obj === new String().toString()

const preformQuickResult = async dataPath => {
    if (!dataPath || isEmptyString(dataPath)) return null;
    else return await MakeQuick(dataPath);
}

class Mac {
    constructor() {
        throw new Error("This class can not be initializated");
    }

    static async isMusicPlaying() {
        const musicData = await IScripts.runFile(musicGetterPath);
        const musicPlayer = await IScripts.runFile(musicPlayerPath);

        if (!musicData) return null;
        if (!musicPlayer) return null;

        if (isArray(musicData) && musicData.length > 0) {
            let protoMusicData = [...musicData, musicPlayer];
            return protoMusicData;
        } else if (isArray(musicData) && musicData.length === 0 || musicData.length < 0)
            return null;

        let resolvedMusicData = await preformQuickResult(musicData);
        if (!resolvedMusicData) return null;

        resolvedMusicData.push(musicPlayer);

        return resolvedMusicData;
    }
}

module.exports = Mac;