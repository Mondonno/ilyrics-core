// testing if the windows version will work with the win-api

const { Error } = require("../util/Errors");
const { U } = require("win-api");
const u32 = U.load(['FindWindowExW', 'SetWindowTextW']);

const findWindow = async (applicationName) => {
    const appName = Buffer.from(applicationName + "\0", 'ucs2');
    const windowData = await new Promise((resolve, reject) => {
        u32.FindWindowExW.async((0, 0, appName, null, (err, hwnd) => {
            if (err) reject(err);
            else resolve(hwnd);
        }))
    })

    return windowData
}

const getWindowData = async (applicationName) => {
    const windowHwnd = await findWindow(applicationName);
    const windowData = await new Promise((resolve, reject) => {
        let writeDataBuffer = new String();
        u32.GetWindowTextW.async(windowHwnd, writeDataBuffer, null, err => {
            if (err) reject(err);
            else resolve(writeDataBuffer);
        })
    })

    return windowData;
}

const getMusicWindowData = async (playerName) => {
    let downloadedWindowData = await getWindowData(playerName);
    let windowData = new Array(); // all the window data allocations

    if (downloadedWindowData) {
        windowData.push(downloadedWindowData);
    }

    if (!windowData) return;

    let artist, track;
    try {
        let musicData = windowData[0].split(' - ');

        artist = musicData[0];
        track = musicData[1];
    } catch (e) {
        throw new Error(e);
    }
}

class Windows {
    constructor() {
        throw new Error("This class can not be initializated");
    }

    static async getMusicData() {

    }
}

module.exports = Windows;