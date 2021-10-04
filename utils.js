const tokens = require("./authorized.json")

// i mean... preatty self explainatory :P
const makeID = (length) => {
    var result = [];
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
    return result.join('');
}

const checkAuthType = (header) => {
    if (header) {
        var tokenFound = null
        // check if an authorization field is present in the header
        if (header.authorization) {
            const authType = header.authorization.split(" ");
            // check if authorzation type is a bearer token
            if (authType[0] == "Bearer") tokenFound = authType[1];
            // check if authorization type is a basic authorization
            if (authType[0] == "Basic")
                for (var token of tokens) {
                    var newToken = btoa("token:" + token);
                    if (newToken == authType[1]) {
                        tokenFound = token;
                        break;
                    }
                };
        // check if an api token is given
        } else if (header.token) tokenFound = header.token;
    }
    // if a token has been found then send let the server send the response to the client
    if (tokenFound && tokens.includes(tokenFound)) return true;
    return false;
}

const timeouts = []
const isInTimeout = (ip) => {
    // split the start of the ip :ffff:
    ip = ip.split(":")
    ip = ip[3]
    // check if the ipv4 is in the timeouts array
    if (!timeouts.includes(ip)) {
        // if not then push it
        timeouts.push(ip)
        // wait for 2 seconds and then remove the ip from the timeouts array
        setTimeout(() => { const index = timeouts.indexOf(ip); timeouts.splice(index, 1); }, 2000)
        return false
    }
    return true
}

module.exports = { makeID, isInTimeout, checkAuthType }