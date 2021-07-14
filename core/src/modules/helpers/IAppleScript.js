const appleScript = require("applescript");

class IAppleScriptRunner {
    constructor() {
        throw new Error("This class can not be initialiated")
    }

    static async runFile(path, args = []) {
        return await new Promise((resolve, reject) => appleScript.execFile(new String(path).toString(), args, (err, data) => {
            if (err) reject(err);
            else resolve(data);
        }));
    }
    static async runString(script) {
        return await new Promise((resolve, reject) => appleScript.execString(script, (err, data) => {
            if (err) reject(err)
            else resolve(data);
        }));
    }
}

module.exports = IAppleScriptRunner;