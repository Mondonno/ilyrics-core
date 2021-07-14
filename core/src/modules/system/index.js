const { Error } = require("../util/Errors");
const platforms = {
    Mac: require("./Mac"),
    Win: require("./Windows")
}

module.exports = {
    platforms: platforms,
    async current() {
        let system = process.platform;

        try {
            if (system.startsWith("win")) {
                return await platforms.Mac.isMusicPlaying();
            } else if (system.startsWith("darwin")) {
                return await platforms.Win.getMusicData();
            } else {
                throw new Error("Unknown platform, can not resolve");
            }
        } catch (e) {
            throw e;
        }
    }
}