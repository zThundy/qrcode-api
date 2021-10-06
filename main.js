const app = require("express")();
const { makeID, isInTimeout, checkAuthType, generateQR } = require("./utils.js");
const fs = require("fs")

const credentials = {
    // key: fs.readFileSync('/etc/letsencrypt/archive/phoneauth.it/privkey1.pem'),
    // cert: fs.readFileSync('/etc/letsencrypt/archive/phoneauth.it/cert1.pem')
}
const https = require("https").createServer(credentials, app);
const HTTP_PORT = 80;
const HTTPS_PORT = 443;

app.set('trust proxy', 1);
app.set('view engine', 'ejs');

// app.get("*", async (req, res) => {
//     res.redirect('https://' + req.headers.host + req.url);
// })

app.get("/", async (req, res) => {
    if (!isInTimeout(req.headers['x-forwarded-for'] || req.connection.remoteAddress)) {
        const qr = await generateQR(req.query.value)
        res.render('qrcode', { qrurl: qr, error: false });
        res.end();
    } else {
        res.render('qrcode', { qrurl: "", error: "You are making too many requests" });
        res.end();
    }
})

app.get("/:variable", async (req, res) => {
    if (!isInTimeout(req.headers['x-forwarded-for'] || req.connection.remoteAddress)) {
        if (req.params && req.params.variable) {
            const qr = await generateQR(req.params.variable)
            res.render('qrcode', { qrurl: qr, error: false });
            res.end();
        }
    } else {
        res.render('qrcode', { qrurl: "", error: "You are making too many requests" });
        res.end();
    }
})

app.post("*", async (req, res) => {
    if (checkAuthType(req.headers)) {
        if (!isInTimeout(req.headers['x-forwarded-for'] || req.connection.remoteAddress)) {
            var tmp_id = makeID(25);
            const qr = await generateQR(req.headers.value || tmp_id)
            res.json({ code: 200, id: req.headers.value || tmp_id, response: qr });
            res.end();
        } else {
            res.status(403).json({ code: 403, response: "You are making too many requests" });
            res.end();
        }
    } else {
        res.status(403).json({ code: 403, response: "Missing authorization token" });
        res.end();
    }
})

app.listen(HTTP_PORT, (err) => {
    if (err) console.err(err);
    console.log(`[APP] Http server listening on port ${HTTP_PORT}`)
})

https.listen(HTTPS_PORT, (err) => {
    if (err) console.err(err);
    console.log(`[APP] Https server listening on port ${HTTPS_PORT}`)
})