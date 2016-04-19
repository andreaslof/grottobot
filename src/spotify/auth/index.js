import { spotifyApi } from '../server';
import renderPage from '../utils/renderPage';

const scopes = [
  'playlist-modify-public',
  'playlist-modify-private'
];

function html (protocol, hostname) {

  const authUrl = spotifyApi.createAuthorizeURL(scopes, 'grotto-state-of-mind');

  return renderPage('Auth', {
    pageTitle: 'Auth',
    authUrl
  });

}

function auth (req, res) {

  res.send(html(req.protocol, req.hostname));

}

export default auth;
