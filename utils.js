const tokens = require("./authorized.json")

const makeID = (length) => {
    var result = [];
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
    }
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
    if (tokenFound && tokens.includes(tokenFound)) return true;
    return false;
}

module.exports = { makeID, checkAuthType }