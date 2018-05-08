const express = require('express');
const Twit = require('twit');
const request = require('request');
const promise = require('request-promise');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const path = require("path");


// const TW-TRENDS_URL = "http://1.1/trends/place.json"
// const TW-LIVE_URL = "http://1.1/statuses/filter.json"

var TW_KEYS = {
  consumer_key: process.env.TW_CONSUMER_KEY,
  consumer_secret: process.env.TW_CONSUMER_SECRET
}

var Twitter = new Twit({
  consumer_key: process.env.TW_CONSUMER_KEY,
  consumer_secret: process.env.TW_CONSUMER_SECRET,
  access_token: process.env.TW_TOKEN_KEY,
  access_token_secret: process.env.TW_TOKEN_SECRET,
  // timeout_ms: 60*1000,  // optional HTTP request timeout to apply to all requests.
})




const app = express();

const port = process.env.PORT || 5000;

if (process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname, 'client/build')));
}

app.use(favicon(path.join(__dirname, 'client/src/media', 'favicon.ico')))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Priority serve any static files.


var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
    res.sendStatus(200);
  } else {
    next();
  }
};

app.use(allowCrossDomain);

app.get('/api/twitter/reverse_geocode', (req, res) => {
  var parameters = {
    lat: req.query.lat,
    long: req.query.long,
  }

  Twitter.get('geo/reverse_geocode', parameters)
    .then(response => {
       res.send(response);
    })
    .catch(e => {
      res.sendStatus(res.statusCode).send(e);
    })
  });

app.get('/api/twitter/geocode', (req, res) => {
  var parameters = {
    query: req.query.query
  }

  Twitter.get('geo/search', parameters)
    .then(response => {
       res.send(response.data.result.places[0].centroid);
    })
    .catch(e => res.sendStatus(res.statusCode).send(e)
    )

});

app.get('/api/twitter/search', (req, res) => {

  let q = '';
  if(req.query.q){
    q = req.query.q;
  }

  let geocode = '';
  if(req.query.geocode){
    geocode = req.query.geocode;
  }

  let until = '';
  if(req.query.until){
    until = req.query.until;
  }

  var parameters = {
    q : q,
    geocode: geocode,
    until: until,
    lang: "en",
    result_type: "mixed",
    count: 100,
    include_entities: true,
  }
  // console.log(q);
  console.log("Searching, q="+q+", geocode="+geocode+"until="+until)
  Twitter.get('search/tweets', parameters)
    .then(response => {
       res.send(response);
    })
    .catch(e => res.status(500).send('Something broke!')
    )
});


app.post('/api/sentiment', (req, res) => {
  var parameters = {
    method: 'POST',
    uri: "http://www.sentiment140.com/api/bulkClassifyJson",
    body : req.body,
    headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
    },
    json: true
  }
    promise(parameters)
        .then(response => {
          res.send(response)
        })
        .catch(e => {
          console.log(e)
          res.status(500).send('Something broke!')
        });
});


if (process.env.NODE_ENV === "production"){
  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
  });
}

app.listen(port, () => console.log(`Listening on port ${port}`))
