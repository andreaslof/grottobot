import has from 'lodash.has';
import last from 'lodash.last';

const RtmClient = require('@slack/client').RtmClient;
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;
const API_TOKEN = process.env.SLACK_API_TOKEN || '';
const logLevel = process.env.GROTTOBOT_LOG_LEVEL || 'debug';

if (API_TOKEN === '') {

  console.error('no Slack API token defined in env, exiting');
  process.exit(1);

}

const SPOTIFY_LINK = /(open.spotify.com\/track\/|spotify:track:)(\w+)/i;

const rtm = new RtmClient(API_TOKEN, { logLevel });
rtm.start();

rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, (rtmStartData) => {

  console.log(`data from RTM ====> `, rtmStartData);

  if (rtmStartData.ok) {
    console.log(`auth succeeded, here's the grottobot!`);
  }

});

rtm.on(RTM_EVENTS.MESSAGE, (payload) => {

  console.log(`got a message, raw data here =====>`, payload);
  let { text, hidden, subtype } = payload;

  if (hidden || subtype === 'message_changed') {
    return;
  }

  if (SPOTIFY_LINK.test(text)) {
    const song_uri = last(text.match(SPOTIFY_LINK));

    addToPlaylist(song_uri);
  }

});

function addToPlaylist(song_uri='') {

  if (song_uri === '') return;

  const full_track_uri = `spotify:track:${song_uri}`;

  console.log(`heyo, add track w URI ===> ${full_track_uri} to playlist`);

}
