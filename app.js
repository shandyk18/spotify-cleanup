const express = require('express');
const cors = require('cors');
const SpotifyWebApi = require('spotify-web-api-node');

require('dotenv').config();

const app = express();
const port = 8000;

let spotifyApi;

app.use(cors()); // To handle cross-origin requests
app.use(express.json()); // To parse JSON bodies

app.post('/login', (req, res) => {
  const code = req.body.code;
  const credentials = {
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: "http://localhost:3000/viz",
    // accessToken: code
  };

  spotifyApi = new SpotifyWebApi(credentials);

  // Retrieve an access token
  spotifyApi.authorizationCodeGrant(code).then((data) => {
    // Returning the User's AccessToken in the json formate
    res.json({
        accessToken : data.body["access_token"],
    });
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch((err) => {
    console.log(err);
    res.sendStatus(400);
  })

});

app.get('/saved', (req, res) => {
  spotifyApi.getMySavedTracks({
    limit: 50,
    offset: req.query.offset
  })
  .then((data) => {
    res.json({
      items : data.body["items"].data.items,
    });
  })
  .catch((err) => {
    console.log(err);
    res.sendStatus(400);
  })
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
});
