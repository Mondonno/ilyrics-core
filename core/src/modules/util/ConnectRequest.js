const fetch = require("node-fetch");

const deafultHeaders = (url, type = "application/json") => new Object({
    "Content-Type": type,
    "User-Agent": "iLyrics App",
    "Connection": "keep-alive",
    "Cache-Control": "no-cache",

    "X-Do-Not-Track": "*/*",
    "Keep-Alive": "*/*",
    "Accept": "*/*",
    "Referer": `${url.toString()}`,
})

const resolveData = res => {
    if (!res instanceof Object) throw new Error("The \"res\" is not the \"Object\"");
    let contentType = {
        type: res.headers.get("content-type"),
        is: function (type) {
            return this.type.startsWith(new String(type).toString());
        }
    }

    if (contentType.is("application/json")) return res.json();
    else if (contentType.is("text/html")) return res.text();

    return res.buffer();
}

class Request {
    constructor(url, method = "GET", options = {}) {
        if (!(url || method)) throw new Error("The url/method can not be empty");

        this.deafultHeaders = deafultHeaders(url);

        this.url = url;
        this.method = method;
        this.options = options;
    }

    async make() {
        let headers = Object.assign({}, this.deafultHeaders);
        let body;

        if (this.options.headers) Object.assign(headers, this.options.headers);
        if (this.options.body) body = JSON.stringify(this.options.body);

        let respone = await fetch(this.url, {
            method: this.method,
            headers,
            body,
            timeout: 60000
        });
        let json = await resolveData(respone);

        return json;
    }
}


module.exports = Request;