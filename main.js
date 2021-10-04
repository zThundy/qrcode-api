const app = require("express")();
const QRCode = require('qrcode');
const { makeID, isInTimeout, checkAuthType } = require("./utils.js")

const PORT = 80;
const ID_LENGHT = 25;

app.set('trust proxy', 1);
app.set('view engine', 'ejs');

app.post("*", (req, res) => {
    if (checkAuthType(req.headers)) {
        if (!isInTimeout(req.headers['x-forwarded-for'] || req.connection.remoteAddress)) {
            var tmp_id = makeID(ID_LENGHT);
            QRCode.toDataURL(tmp_id, { quality: 1.0 }, (err, url) => {
                if (err) console.err(err);
                res.json({ response: url, id: tmp_id, code: 200 });
                res.end();
            })
        } else {
            res.status(403).json({ code: 403, response: "You are making too many requests" });
            res.end();
        }
    } else {
        res.status(403).json({ code: 403, response: "Missing authorization token" });
        res.end();
    }
})

app.listen(PORT, (err) => {
    if (err) console.err(err);
    console.log(`[APP] Listening on port ${PORT}`)
})