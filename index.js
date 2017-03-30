const express = require('express');
const app = express();
const webshot = require('webshot');
const urlObj = require('url');

const request = require('request');
const moment = require('moment');

const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const IMG_TYPE = 'jpg';
const IMG_QUALITY = 60;
const IMG_SIZE_X = 1280;
const IMG_SIZE_Y = 1024;

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://heroku_tlfjlb8r:u3io6qf4fa9mco4qonqs15g41g@ds145750.mlab.com:45750/heroku_tlfjlb8r";

mongoose.connect(MONGODB_URI);
const Schema = mongoose.Schema;

// create a schema
const linkSchema = new Schema({
    title: { type: String, required: true },
    url: { type: String, required: true,unique: true },
    desc: String,
    img: String,
    tags: String,
    created_at: Date
});

// the schema is useless so far
// we need to create a model using it
const LinkItem = mongoose.model('LinkItem', linkSchema);

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

function fetchDomain(url,title,desc,tags,res) {
    checkDomain(url).then(function (res3) {
        console.log('take screenshot ... ' + res3);
        let options = {
            quality: IMG_QUALITY,
            streamType: IMG_TYPE,
            screenSize: {
                width: IMG_SIZE_X,
                height: IMG_SIZE_Y
            }
        };
        let host = urlObj.parse(url).hostname;
        let now = moment().valueOf();
        let filename = host + '-' +now + '.' + IMG_TYPE;
        webshot(url, filename, options, function (err) {
            // screenshot now saved to google.png

            console.log('screenshot done ');
            let link = new LinkItem({
                title: title,
                url: url,
                desc: desc,
                img: filename,
                tags: tags,
                created_at: now
            });
            link.save(function(err) {
                if (err){
                    res.end('{"failed" : "not saved", "status" : 200}');
                    console.log(err);
                } else{
                    console.log('User saved successfully!');

                    res.end('{"success" : "Updated Successfully", "status" : 200}');

                }

                });

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
app.use(express.static(__dirname + ''));
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

    fetchDomain(url,title,desc,tags,res);
    //res.end("yes");
});

app.get('/', function (request, response) {
    LinkItem.find({}, function(err, items) {
        // object of all the users
        console.log(items);
        if(err){
            response.render('pages/index');
        }else{
            response.render('pages/index', {links : items});
        }
    });

});

app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});


