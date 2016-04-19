import { spotifyApi } from './server';

function addToPlaylist (songURI='') {

  if (songURI === '') return;

  const fullTrackURI = `spotify:track:${songURI}`;
  const user = 'ahermansson';
  const playlistId = `3fsvwkb2jmLCMU3znXyyNi`;

  return new Promise((resolve, reject) => {

    spotifyApi.addTracksToPlaylist(user, playlistId, [fullTrackURI])
      .then((data) => {
        resolve(data);
      }, (err) => {
        reject(err);
      });

  });

}

export default addToPlaylist;
