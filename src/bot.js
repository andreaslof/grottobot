import last from 'lodash.last'
import addToPlaylist from './spotify/addToPlaylist'

const RtmClient = require('@slack/client').RtmClient
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS
const RTM_EVENTS = require('@slack/client').RTM_EVENTS
const API_TOKEN = process.env.SLACK_API_TOKEN || ''
const logLevel = process.env.GROTTOBOT_LOG_LEVEL || 'debug'

if (API_TOKEN === '') {
  console.error('no Slack API token defined in env, exiting')
  process.exit(1)
}

const SPOTIFY_LINK = /(open.spotify.com\/track\/|spotify:track:)(\w+)/i
const GREETING = /(hi|hello|yo|greetings|hey)/i
const NERD = /(ne+rd)/i
const GREETING_RSP = [ '👋', 'howdy', 'hello', 'heyyyyy there', 'ALL HAIL GROTTOBOT' ]

const rtm = new RtmClient(API_TOKEN, { logLevel })
rtm.start()

rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, (rtmStartData) => {
  if (rtmStartData.ok) {
    console.log(`auth succeeded, grottobot is alive!`)
  }
})

rtm.on(RTM_EVENTS.MESSAGE, (payload) => {
  if (logLevel === 'debug') {
    console.log(`got a message, raw data here =====>`, payload)
  }

  console.log(payload)

  let { channel, user, text, hidden, subtype } = payload

  if (hidden || subtype === 'message_changed') {
    return
  }

  if (GREETING.test(text)) {
    const index = Math.round(Math.random() * GREETING_RSP.length)
    const random = GREETING_RSP.slice(index, index + 1)[0]
    rtm.sendMessage(random, channel)
  }

  if (NERD.test(text)) {
    rtm.sendMessage(`eat shit and die`, channel)
  }

  if (SPOTIFY_LINK.test(text)) {
    const songUri = last(text.match(SPOTIFY_LINK))

    addToPlaylist(songUri).then((res) => {
      console.log(res)
      rtm.sendMessage(`thanks <@${user}>, i've added that track`, channel)
    }).catch((err) => {
      console.error(err)
      rtm.sendMessage(`uh oh, something went wrong… try again!`, channel)
    })
  }
})
