'use strict';

module.exports = {
    Engines: {
        MacOS: require("./modules/system/Mac")
    },
    iLyricsLib: require("./ilyricsLib").iLyricsLib,
    iLyricsParser: require("./ilyricsLib").iLyricsParser,
    IAppleScript: require("./modules/helpers/IAppleScript")
}