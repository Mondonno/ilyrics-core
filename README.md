# ILyrics Core

Ilyrics core is the module to check the current playing music on the user computer via the system preffered scripts.
The usage of this is for example, if you need the acces and providing the types for the current playing music.
This package is created for [iLyrics](https://github.com/Mondonno/iLyrics) project wich helps you to find the lyrics for the current playing song.

# Usage
How to download data? So easy!

*Currently the options in the ilyrics class are unavaible*
```js
const { iLyricsLib } = require("ilyrics-core");
const ilCore = new iLyricsLib({
    lyrics: false, // if marked as true downloading the lyrics for song on the check (soon will be deprecated)
    players: ['QUICK', 'ITUNES', 'SPOTIFY'], // check only selected players (if null checking all players)
    system: null, // leave blank if you does not want to force the execution system
    reapeatLock: false // true if you want to does not leak resources on the againist checks (useful in interval)
});

(async () => {
    const data;
    try {
        data = await ilCore.checkMusic();
    }catch(e) {
        console.error(e);
    }

    if(data){ 
        return console.log(data.details.name); // logging music name
    }
})
```

# Supported Players
The supported players are only 3 and only on MacOS but working to support more platforms (linux and win32, win64)
Players are sorted by the data pioritity.

- iTunes `(1)`
- Spotify `(2)`
- Quick Time Player `(3)`

# Todo

- Add support for Windows and Linux platforms
- Add support for the iLyricsLib options

#### [Available on NPM](https://www.npmjs.com/package/ilyrics-core)