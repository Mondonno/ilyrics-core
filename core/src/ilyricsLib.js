const { NoEnoughAttributes, MusicGetReapeted } = require("./modules/util/Errors");
const MacOS = require("./modules/system/Mac");
const LyricsInterface = require("./modules/helpers/ILyricsInterface");

class iLyricsParser {
    constructor() {
        throw new Error("You can not initialize this class");
    }

    static getMusicPlayerCode(player) {
        if (player && typeof player === "string")
            player = player.toUpperCase()

        let musicPlayers = {
            "APPLE_MUSIC": 1,
            "SPOTIFY": 2,
            "QUICKTIMEPLAYER": 3
        }

        let convertedMusicPlayer = musicPlayers[player] || 0;
        return convertedMusicPlayer;
    }

    static getMusicPlayer(player) {
        if (player && typeof player === "string")
            player = player.toUpperCase()

        let musicPlayers = {
            "APPLE_MUSIC": "Apple Music (iTunes)",
            "SPOTIFY": "Spotify",
            "QUICKTIMEPLAYER": "QuickTime Player"
        }

        let unknownPlayer = "Unknown"
        let convertedMusicPlayer = musicPlayers[player] || unknownPlayer;
        return convertedMusicPlayer;
    }

    static convertMusicData(data) {
        if (data === null || !data.length) return null; // stopped or not array
        const {
            0: musicName,
            1: musicAuthor,
            2: musicPlayer
        } = data;

        return {
            musicName,
            musicAuthor,
            musicPlayer
        }
    }
}

class iLyricsLib {
    constructor() {
        this.lastCachedSong = null;
    }

    updateCurrentSong(newSong) {
        this.lastCachedSong = newSong;
    }

    isMusicHasAttributes(data) {
        if (data instanceof Array) {
            return (data.length - 1) >= 2;
        }

        if (!data.musicName) return false;
        else if (!data.musicAuthor) return false;
        else if (!data.musicPlayer) return false;
        else return true;
    }

    async checkMusic() {
        const handleLyrics = async songInfo => {
            let lyricsErrored = false; // deafult value
            let apiLyrics = null;

            try {
                apiLyrics = await LyricsInterface.getLyricsFromApi(songInfo);
            } catch (e) {
                lyricsErrored = true
            }

            let baseObject = {
                content: null,
                url: null,
                ok: !lyricsErrored
            }

            if (!apiLyrics) return baseObject; // hotfix #14

            Object.assign(baseObject, {
                content: apiLyrics.content,
                url: apiLyrics.url,
                ok: !lyricsErrored
            })
            return baseObject;
        }

        const musicData = await MacOS.isMusicPlaying();
        const convertedMusicData = iLyricsParser.convertMusicData(musicData);
        const isMusicStopped = convertedMusicData === null;

        if (isMusicStopped) {
            this.updateCurrentSong(null);
            return;
        }
        if (convertedMusicData && (this.lastCachedSong ? convertedMusicData.musicName === this.lastCachedSong.details.name : false)) {
            throw new MusicGetReapeted();
        }

        const isMusicHasAttributesBoolean = this.isMusicHasAttributes(convertedMusicData);

        if (!isMusicHasAttributesBoolean) {
            throw new NoEnoughAttributes();
        }

        const rawMusicPlayer = convertedMusicData.musicPlayer;
        const musicPlayer = iLyricsParser.getMusicPlayer(convertedMusicData.musicPlayer);
        const musicLyrics = await handleLyrics(convertedMusicData);

        const responseValue = {
            details: {
                name: convertedMusicData.musicName,
                author: convertedMusicData.musicAuthor,
                player: {
                    name: musicPlayer,
                    raw: rawMusicPlayer,
                    code: iLyricsParser.getMusicPlayerCode(rawMusicPlayer)
                }
            },
            lyrics: musicLyrics
        }

        this.updateCurrentSong(responseValue);

        return responseValue;
    }
}

module.exports = {
    iLyricsLib,
    iLyricsParser
}