import fs from 'fs';
import { spotifyApi } from '../server';
import renderPage from '../utils/renderPage';

function setTokens () {

  const spotAuth = JSON.parse(fs.readFileSync(`${process.cwd()}/.spotauth`));

  spotifyApi.setAccessToken(spotAuth.access_token);
  spotifyApi.setRefreshToken(spotAuth.refresh_token);

}

function html (params={}) {

  const { auth } = params;

  if (auth === 'done') {

    setTokens();

  }

  return renderPage('Home', {
    pageTitle: 'Home',
    test: `this is us testing rendering`
  });

}

function home (req, res) {

  res.send(html(req.query));

}

export default home;
