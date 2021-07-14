const fileMetadata = require("file-metadata");
const parsePath = path => [path.split(":"), path.split(":").join("/")]

function resolveMetadata(metaData) {
    if (!(metaData instanceof Object)) return null;

    let keys = new Array();
    let requiredProps = ["title", "displayName", "fsName", "album", "authors", "composer"];

    for (const key in metaData) metaData.hasOwnProperty(key) ? keys.push(key) : null;
    let types = keys.hasOwnProperty("mediaTypes") ? (metaData.mediaTypes.includes("Sound") ? true : false) : false

    if (types) return null;
    for (const prop of requiredProps)
        keys.includes(prop.toString()) ? null : metaData[prop] = new String().toString();

    let object = {
        name: metaData.title,
        author: metaData.authors,
        composer: metaData.composer,
        album: metaData.album,
        fileName: metaData.fsName,
        displayName: metaData.displayName
    }

    let authorCheck = ((!object.author) || (!object.author.length) || (object.author === ""))
    let composerCheck = ((!object.composer) || (object.composer === ""));

    if (authorCheck)
        composerCheck ? object.author = object.composer : null
    return object;
}

async function quickTimePlayerExtractor(path) {
    try {
        let rawPath = path.toString();
        let splittedPathString = parsePath(rawPath)[0];

        let correctedPathArray = splittedPathString; // string array
        let pathConverted = parsePath(correctedPathArray.join(":"))[1];
        let pathResolved = `/Volumes/${pathConverted}`; // macos restricted

        const quickTimeMetadata = await fileMetadata(pathResolved);
        const resolvedMetada = resolveMetadata(quickTimeMetadata);

        if (resolvedMetada == null) return new Array();

        let data = [resolvedMetada.name, resolvedMetada.author];

        for (const value in data) {
            typeof value === "number" ? value = data[value] : null;

            let makeCheck = (target, value) => target === value;

            const index = data.findIndex(e => e === value);
            _ = !(makeCheck(value, undefined) || makeCheck(value, null) || makeCheck(value.replace(/ /g, ""), ""))
                ? null : data[index] = '';
        }

        return data;
    } catch {
        return null;
    }
}

module.exports = quickTimePlayerExtractor;