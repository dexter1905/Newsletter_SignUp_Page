const { response } = require('express');
const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
    const fName = req.body.fName;
    const lName = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [{
            email_address: req.body.email,
            status: "subscribed",
            merge_fields: {
                FNAME: fName,
                LNAME: lName
            }
        }]
    }

    const jsonData = JSON.stringify(data);
    const url = 'https://us2.api.mailchimp.com/3.0/lists/be97c7ad19';
    const options = {
        method: "POST",
        auth: "dexter1:9fc77c258f709305a93b837d3e47039c-us2"
    };
    const request = https.request(url, options, (response) => {
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", (data) => {
            console.log(JSON.parse(data));
        });
    })
    request.write(jsonData);
    request.end();
});

app.post("/failure", (req, res) => {
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, () => {
    console.log("Server started on port 3000");
});

// API key
// 9fc77c258f709305a93b837d3e47039c-us2

// Audience ID
// be97c7ad19