import { spotifyApi } from '../server';
import renderPage from '../utils/renderPage';

function html () {

  return `fetching access token, please wait...`;

}

function authBack (req, res) {

  res.send(html());

}

export default authBack;
