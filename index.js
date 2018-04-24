const express = require('express');
var Twit = require('twit');
const fetch = require('node-fetch');
const FetchTweets = require('fetch-tweets');
const request = require('request');
const path = require("path");


const TW_URL = "http://1.1/search/tweets.json"  // Twitter search URL
// const TW-GEO_URL = "http://1.1/geo/search.json"
// const TW-REVERSE-GEO_URL = "http://1.1/geo/reverse_geocode.json"
// const TW-TRENDS_URL = "http://1.1/trends/place.json"
// const TW-LIVE_URL = "http://1.1/statuses/filter.json"

const SEN_URL =  "http://www.sentiment140.com/api/bulkClassifyJson" // URL of sentiment analysis

var TW_KEYS = {
  consumer_key: process.env.TW_CONSUMER_KEY,
  consumer_secret: process.env.TW_CONSUMER_SECRET
}

var Twitter = new Twit({
  consumer_key: process.env.TW_CONSUMER_KEY,
  consumer_secret: process.env.TW_CONSUMER_SECRET,
  access_token: process.env.TW_TOKEN_KEY,
  access_token_secret: process.env.TW_TOKEN_SECRET
  // timeout_ms: 60*1000,  // optional HTTP request timeout to apply to all requests.
})


const app = express();
const fetchTweets = new FetchTweets(TW_KEYS);

const port = process.env.PORT || 5000;

// Priority serve any static files.
app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/api/twitter/reverse_geocode', (req, res) => {
  var parameters = {
    lat: req.query.lat,
    long: req.query.long,
  }

  Twitter.get('geo/reverse_geocode', parameters)
    .then(response => {
       res.send(response.data.result.places);
    })
    .catch(e => res.status(500).send('Something broke!')
    )

  });

// For getting tweets like /api/twitter?q=hello&geocode=234523 etc.
app.get('/api/twitter', async (req, res) => {
    console.log("Getting tweets")
    const options = {
      q : req.query.q,
      // geocode: req.query.geocode,
      lang: "en",
      result_type: "popular",
      count: 100,
    }
    try{
      await fetchTweets.byTopic(options, function(results){
        console.log("sending results")
        res.send(results)
      })
  //    const json = await response.json()
    }catch (error){
      console.log(error)
    }
})

app.get('/api/sentiment', async (req, res) => {
  const options = {
    q : req.query.q,
    geocode: req.query.geocode,
    lang : "en",
    count : 100,
  }
  try{
    fetchTweets.byTopic(options, async function(results){
      const tweets = {"data": results.map(function(tweet){
        return {"text": tweet.body, "query": options.q, "geocode":options.geocode}
      })}
      var body = JSON.stringify(tweets)

      // get sentiments
      const sentiments = await fetch(SEN_URL, {method: "POST", body: body})
      const json = await sentiments.json()
      const data = json.data


      // calculate percentages
      const response = {positive: undefined, neutral: undefined, negative: undefined}
      var numPos = 0
      var numNeu = 0
      var numNeg = 0
      //console.log(response)
      data.forEach(function(tweet){
        switch(tweet.polarity){
          case 4:
            numPos += 1
            break
          case 2:
            numNeu += 1
            break
          case 0:
            numNeg += 1
            break
        }
      })
      const tot = numPos + numNeu + numNeg
      response.positive = numPos/tot
      response.neutral = numNeu/tot
      response.negative = numNeg/tot
      response.tweets = tweets

      // send response
      res.send(response)
    })
  }catch (error){
    console.log(error)
    res.send(error)
  }
})

if (process.env.NODE_ENV === "production"){
  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
  });
}

app.listen(port, () => console.log(`Listening on port ${port}`))
