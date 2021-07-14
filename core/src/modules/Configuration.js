const pathLib = require("path");
const scriptsPath = path => pathLib.join(pathLib.dirname(__dirname), "scripts", path);

const appleScripts = scriptsPath("appleScripts");
const powerShellScripts = scriptsPath("powerShellScripts"); // deprecated

module.exports = {
    appleScripts,
    powerShellScripts,
}