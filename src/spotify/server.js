import fs from 'fs';
import express from 'express';
import { renderFile } from 'ejs';
import SpotifyWebApi from 'spotify-web-api-node';

import routes from './routes';
import { redirectUri } from './routes';
import config from './config';

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  console.log('no spotify api client details found');
  process.exit(1);
}

const app = express();
const spotifyApi = new SpotifyWebApi({ clientId, clientSecret });

try {
  const spotAuth = JSON.parse(fs.readFileSync(`./.spotauth`));

  spotifyApi.setAccessToken(spotAuth.access_token);
  spotifyApi.setRefreshToken(spotAuth.refresh_token);
} catch(e) {
}

app.set('x-powered-by', false);
app.use((req, res, next) => {

  const { protocol, hostname } = req;

  if (!spotifyApi.getRedirectURI()) {

    spotifyApi.setRedirectURI(`${protocol}://${hostname}:${config.port}${redirectUri}`);

  }

  next();

});
app.use(redirectUri, (req, res, next) => {

  const { code, state } = req.query;
  const authFile = `${process.cwd()}/.spotauth`;

  spotifyApi.authorizationCodeGrant(code)
    .then((authData) => {

      fs.writeFile(authFile, JSON.stringify(authData.body), (err) => {

        if (err) {
          console.error(err);
          res.redirect(`/auth`);
        }

        res.redirect(`/?auth=done`);

      });

    }, (err) => {

      res.redirect(`/auth`);

    });

});

routes(app);

export default app;
export { spotifyApi }
