import has from 'lodash.has';
import last from 'lodash.last';
import addToPlaylist from './spotify/addToPlaylist';

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

  if (rtmStartData.ok) {
    console.log(`auth succeeded, here's the grottobot!`);
  }

});

rtm.on(RTM_EVENTS.MESSAGE, (payload) => {

  console.log(`got a message, raw data here =====>`, payload);
  let { channel, user, text, hidden, subtype } = payload;

  if (hidden || subtype === 'message_changed') {
    return;
  }

  if (SPOTIFY_LINK.test(text)) {
    const song_uri = last(text.match(SPOTIFY_LINK));

    addToPlaylist(song_uri).then((res) => {
      rtm.sendMessage(`thanks <@${user}>, i've added that track`, channel);
    }).catch((err) => {
      console.error(err);
      rtm.sendMessage(`uh oh, something went wrong… try again!`, channel);
    });
  }

});
