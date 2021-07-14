let decoder = require('unidecode');

let unidecoder = string => {
    if (typeof string === "number") string = new String(string).toString();
    if (typeof string !== "string") throw new Error("Can not validate non string");

    return decoder(string).toString();
};

let groupMatch = match => {
    if (!match) return undefined;

    let matches = new Array();
    for (const key in match) {
        if (!isNaN(Number(key))) matches.push(match[key]);
        else continue;
    }

    return {
        matches: matches ? matches.filter(e => e) : [],
        count: function () {
            return this.matches.length
        },
        group: function (index = 0) {
            return this.matches[index];
        }
    };
}

let strip = string => string && typeof string === "string" ? string.trim() : string
let toString = (string = new String().toString()) => new String(string).toString()

// Credits to SwagLyrics for regexes
let brc = /([(\[](feat|ft|From "[^"]*")[^)\]]*[)\]]|- .*)/gi // Matches braces with feat included or text after -, also adds support for Bollywood songs by matching (From "<words>")
let aln = /[^ \-a-zA-Z0-9]+/g // Matches non space or - or alphanumeric characters
let spc = / *- *| +/g // Matches one or more spaces
let wth = /(?: *\(with )([^)]+)\)/ // Capture text after with
let nlt = /[^\x00-\x7F\x80-\xFF\u0100-\u017F\u0180-\u024F\u1E00-\u1EFF]/g // Match only latin characters

function urlCustomizer(song, artist) {
    if (!song || !artist) throw new Error("The song or artist is empty or undefinded.");

    artist = toString(artist);
    song = strip(toString(song).replace(brc, ''));

    let ft = groupMatch(song.match(wth));

    if (ft && ft.count()) {
        let art = ft.group(1);
        song = song.replace(ft.group(), ''); // Replacing the artist(s) from the song

        art.includes('&') ? artist += `-${art}` : artist += `-and-${art}`;
    }

    let songData = `${artist}-${song}`;
    let urlData = songData.replace(/&/g, 'and');

    // Replacing the 'invalid' characters from string via regex to support more songs (!, /, _)
    urlData = urlData.replace(/\!|\/|\_/g, '');

    // Starts removing invalid characters
    for (let char of ['Ø', 'ø'])
        if (urlData.includes(char))
            urlData = urlData.replace(new RegExp(toString(char), 'g'), ''); // Replacing invalid chars and characters

    urlData = urlData
        .replace(/\ł/g, '') // bug fixed the ł replacments (genius url)
        .replace(nlt, ''); // Removing non latin chars
    urlData = unidecoder(urlData);

    urlData = urlData.replace(aln, '');
    urlData = strip(urlData).replace(spc, '-');

    return urlData;
}

module.exports = urlCustomizer;