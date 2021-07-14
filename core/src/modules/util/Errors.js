'use strict';

const errorCode = Symbol("code");

function makeiLyricsError(Base) {
    return class iLyricsError extends Base {
        constructor(name, ...args) {
            super(makeErrorMessage(name, args));

            this[errorCode] = name;
            this['args'] = args;

            if (Error.captureStackTrace)
                Error.captureStackTrace(this, iLyricsError);
        }

        get name() {
            return `${super.name}${this.args && this.args.length ? ' ' + this.args.join(" - ") : ''}`
        }

        get code() {
            return this[errorCode];
        }
    }
}

function makeErrorMessage(name, args) {
    if (typeof name !== "string") throw new Error("The name must be a string");
    if (!args || args.length === 0) return name;
    else if (args.length) return `${name}  ${args.join(" - ")}`;
    else return name;
}

const errorsTabel = {
    Error: makeiLyricsError(Error),
    TypeError: makeiLyricsError(TypeError),
    RangeError: makeiLyricsError(RangeError)
}

class NoEnoughAttributes extends errorsTabel['Error'] {
    constructor(...args) {
        super('The recived music does not have the required attributes', args);
    }

    get name() {
        return 'NoEnoughAttributes';
    }
}

class MusicGetReapeted extends errorsTabel['Error'] {
    constructor(...args) {
        super('The prevorius cached music get occurned', args);
    }

    get name() {
        return 'MusicGetReapeted';
    }
}

const defineProperty = (object, name, value) => {
    let propertyObject = {};
    propertyObject[name] = value;

    Object.assign(object, propertyObject);
}

defineProperty(errorsTabel, 'NoEnoughAttributes', NoEnoughAttributes);
defineProperty(errorsTabel, 'MusicGetReapeted', MusicGetReapeted);

module.exports = errorsTabel;