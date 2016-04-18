import express from 'express';
import SpotifyWebApi from 'spotify-web-api-node';
import routes from './routes';

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  console.log('no spotify api client details found');
  process.exit(1);
}

const app = express();

app.set('views', `${__dirname}/v`);
app.set('x-powered-by', false);

routes(app);

export default app;
