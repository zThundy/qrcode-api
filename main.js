const app = require("express")();
const QRCode = require('qrcode');
const { makeID } = require("./utils.js")

const PORT = 80;
const ID_LENGHT = 25;

app.set('trust proxy', 1);
app.set('view engine', 'ejs');

// app.get("*", (req, res) => {
//     QRCode.toDataURL(makeID(ID_LENGHT), { quality: 1.0 }, (err, url) => {
//         if (err) console.err(err);
//         res.render('qrcode', { qrurl: url });
//     })
// })

app.get("*", (req, res) => {
    res.redirect("https://example.org")
})

app.post("*", (req, res) => {
    var tmp_id = makeID(ID_LENGHT);
    QRCode.toDataURL(tmp_id, { quality: 1.0 }, (err, url) => {
        if (err) console.err(err);
        res.json({ data: url, id: tmp_id })
    })
})

app.listen(PORT, (err) => {
    if (err) console.err(err);
    console.log(`[APP] Listening on port ${PORT}`)
})