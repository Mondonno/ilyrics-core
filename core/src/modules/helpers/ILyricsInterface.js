const Request = require("../util/ConnectRequest");
const iCustomizer = new (require("./ICustomizer"))();
const cheerio = require("cheerio");

const geniusDomain = "https://genius.com";

const escapeHtml = html => {
    // old: /(<br>|<br \/>|<br\/>)\n?/gm
    let withoutBr = html
        .replace(/\n/g, '') // fixed the problems with formatted html
        .replace(/(<br\s*\/?>)/g, '\n');

    let withoutTags = withoutBr.replace(/<[^>]*>/g, '');

    return withoutTags;
}

const matchByRegexGetContent = ($, throwedElements, regex) => {
    let textContent = '';

    throwedElements.each((i, e) => {
        let htmlClass = $(e).attr('class');
        if (!htmlClass) return;

        let check = htmlClass.match(regex);
        if (!check) return;

        let text = $.html(e);
        let escaped = escapeHtml(text);

        textContent += escaped;
    })

    return textContent;
}

const checkProperties = obj => {
    if (!(obj instanceof Object)) return;

    let values = Object.values(obj);
    return values.filter(e => e).length !== 0;
}

const checkIndexes = (o, t, a) => {
    if (!Array.isArray(a)) return;
    return a.splice(o, t).filter(e => e).length !== 0;
}

const resolveData = data => {
    let make = (name, author, player) => new Object({
        name,
        author,
        player
    })
    if (Array.isArray(data)) {
        if (!checkIndexes(0, 2)) return;
        return make(data[0], data[1], data[2]);
    } else if (data instanceof Object) {
        if (!checkProperties(data)) return;

        return make(data.musicName, data.musicAuthor, data.musicPlayer);
    } else return null;
}

const extractLyrics = body => {
    const publicLyrics = "div.lyrics";

    const $ = cheerio.load(body);
    const rawLyricsContent = $(publicLyrics);

    if (rawLyricsContent.length > 0) {
        return escapeHtml($.html(rawLyricsContent)).trim();
    }
    else {
        // fallback option

        let lyricsRegex = /^Lyrics__Container/;
        let text = matchByRegexGetContent($, $("div"), lyricsRegex);

        return text ? (typeof text === 'string' ? text.trim() : text) : text;
    }
}

class LyricsInterface {
    static async getLyricsFromApi(songInfo) {
        let baseObject = {
            content: null,
            url: null
        }

        let songData = resolveData(songInfo);
        let createdSongName;
        try {
            createdSongName = await iCustomizer.customize(songData.name, songData.author, "normal");
        } catch {
            return baseObject;
        }

        if (!createdSongName) return baseObject;

        let requestUrl = `${geniusDomain}/${createdSongName}-lyrics`;
        let request = new Request(requestUrl, "GET");
        let responseBody;

        Object.assign(baseObject, { url: requestUrl });

        try {
            responseBody = await request.make();
        } catch (e) { throw new Error(e) }

        let lyrics = await extractLyrics(responseBody);

        return {
            content: lyrics,
            url: requestUrl
        };
    }
}

module.exports = LyricsInterface;