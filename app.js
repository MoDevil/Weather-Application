require('dotenv').config();
const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/', (req, res) => {
    let country = req.body.cityinput;
    let apiKey = process.env.API_KEY;

    if (!apiKey) {
        console.log("API_KEY is not defined in the .env file");
        res.send("API key is missing. Please check your .env file.");
        return;
    }

    let units = "metric";
    if (req.body.tempdegree === 'C') {
        units = "metric";
    } else if (req.body.tempdegree === 'F') {
        units = "imperial";
    } else if (req.body.tempdegree === 'K') {
        units = "standard";
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${country}&units=${units}&appid=${apiKey}`;
    https.get(url, (httpres) => {
        console.log(httpres.statusCode);
        httpres.on('data', function(d) {
            let weatherdata = JSON.parse(d);
            let temp = weatherdata.main.temp;
            let description = weatherdata.weather[0].description;
            let iconid = weatherdata.weather[0].icon;
            let iconimg = `https://openweathermap.org/img/wn/${iconid}@2x.png`;
            let humidity = weatherdata.main.humidity;
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(`<h1>Weather</h1>`);
            res.write(`<h3>Country: ${country}</h3>\n`);
            res.write(`<h3>Temperature: ${temp}</h3>\n`);
            res.write(`<h3>Description: ${description}</h3>\n`);
            res.write(`<h3>Humidity: ${humidity}</h3>\n`);
            res.write(`<img src="${iconimg}" alt="Weather Icon" />`);
            res.send();
        });
    });
});

app.listen(3000, function() {
    console.log('server listening on port 3000');
});
