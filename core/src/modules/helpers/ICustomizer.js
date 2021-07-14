const childProcess = require("child_process"); // only for the python handling (soon will be deleted)

const lanuchProcess = async (path, args) => {
    const { spawn } = childProcess;
    const executeResult = spawn(path, args);

    const executeData =
        await new Promise(resolve =>
            executeResult.on('data', data => resolve(data ? data.toString() : new String().toString())));
    return executeData;
}

class iLyricsUrlCustomizer {
    constructor(ilyrics = null) {
        this.ilyrics = ilyrics;
    }

    async customize(song, artist, type = "normal") {
        let validateCode = this._validateCustomizeOption(type);
        if (validateCode == true) { // normally handling
            let internalCustomizeData = await this._internalNormalCustomize(song, artist);
            return internalCustomizeData;
        } else { // python handling
            throw new Error("This way of getting the genius url is deprecated!");

            let processResultData = await this._internalPythonCustomize(song, artist);
            return processResultData;
        }
    }

    _validateCustomizeOption(option) {
        if (!option) return true;

        return ({
            "python": false,
            "normal": true
        })[new String(option).toString()] || true;
    }

    async _internalNormalCustomize(song, artist) {
        const matcher = (require("./InternalCustomizer")).bind({}, song, artist);
        const result = matcher();

        return result;
    }
    async _internalPythonCustomize(song, artist) {
        const consoleStringEscape = '\'';

        let makeConsoleEscape = text => consoleStringEscape + text + consoleStringEscape;
        let makeNSEscapes = text => text.replace(/\\n/g, '');

        let processData = [song, artist].map(makeConsoleEscape);
        let processArguments = ["module.py", ...processData];

        let resultedData;
        try {
            resultedData = await lanuchProcess("python3", processArguments);
        } catch (e) {
            return;
        }

        return makeNSEscapes(resultedData);
    }
}

module.exports = iLyricsUrlCustomizer;
