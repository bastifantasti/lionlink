const express = require('express');
const app = express();
const webshot = require('webshot');
const urlObj = require('url');

const request = require('request');
const moment = require('moment');

const bodyParser = require("body-parser");

const IMG_TYPE = 'jpg';
const IMG_QUALITY = 60;


/* check domain */

const URLYRAY_API_KEY = process.env.URLXRAY_API_KEY || "2T51JCEHI8MO1S069WN534VAK8R4BXZ02YDLQP79U7GF63";

function checkDomain(url) {
    return new Promise(function (fulfill, reject) {
        request('https://urlxray.expeditedaddons.com/?api_key=' + URLYRAY_API_KEY + '&fetch_content=false&url=' + url, function (error, response, body) {
            console.log('Status:', response.statusCode);

            if (response.statusCode === 200) {
                console.log('true');
                fulfill(true)
            } else {
                reject(false);
            }
        });
    });
}

function fetchDomain(url) {
    checkDomain(url).then(function (res) {
        console.log('take screenshot ... ' + res);
        let options = {
            quality: IMG_QUALITY,
            streamType: IMG_TYPE
        };
        let host = urlObj.parse(url).hostname
        webshot(url, host + '-' + moment().valueOf() + '.' + IMG_TYPE, options, function (err) {
            // screenshot now saved to google.png

            console.log('screenshot done ');
        });
    });
    /*
     if (checkDomain(url)) {
     console.log('take screenshot ... ');
     let options = {
     quality: IMG_QUALITY,
     streamType: IMG_TYPE
     };
     let host = urlObj.parse(url).hostname
     webshot(url, host + '-' + moment().valueOf() + '.' + IMG_TYPE, options, function (err) {
     // screenshot now saved to google.png

     console.log('screenshot done ');
     });
     }
     */

}


app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.post('/addLink',function(req,res){
    let url,title,desc,tags;
    console.log(req.body);
    url = req.body.url;
    title = req.body.title;
    desc = req.body.desc;
    tags = req.body.tags;

    fetchDomain(url);
    res.end("yes");
});

app.get('/', function (request, response) {
    response.render('pages/index');
});

app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});


