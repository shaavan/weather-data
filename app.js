const express = require("express");
const https = require("node:https");

const app = express();

app.use(express.urlencoded({extended: true}));

app.get("/", function (req, res) {
    // res.send("I am here.")

    res.sendFile(__dirname + "/index.html");
})

app.post("/", function(req, res) {
    var query = req.body.cityName;
    var apiKey = "7eb4dd74ac878fd58f283557f55f3fff";
    var unit = "metric"

    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit;
    
    https.get(url, function(response) {
        console.log(response.statusCode);

        if (response.statusCode === 404) {
            res.send("<h2>Sorry, data for <em>" + query + "</em> not found.</h2>");
        }
        else {
            response.on("data", function(data) {
                var weatherData = JSON.parse(data);
                var temperature = weatherData.main.temp;
                var description = weatherData.weather[0].description;
                var iconCode = weatherData.weather[0].icon;
    
                var iconLink = "http://openweathermap.org/img/wn/" + iconCode + "@2x.png";
    
                res.write("<p>The weather description in " + query + " is " + description + "</p>");
                res.write("<h1>The temperature in " + query + " is " + temperature + " degrees Celsius</h1>");
                res.write("<img src=" + iconLink + "></img>");
                res.send();
            });
        }
    })
})






app.listen(3000, function() {
    console.log("I am listening");
})