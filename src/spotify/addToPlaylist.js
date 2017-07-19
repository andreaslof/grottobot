import { spotifyApi, writeAuthFile } from './server'

function probeAuth () {
  return new Promise((resolve, reject) => {
    spotifyApi.getMe()
      .then((user) => {
        resolve()
      }, (err) => {
        const { statusCode } = err

        if (statusCode === 401) {
          spotifyApi.refreshAccessToken()
            .then((data) => {
              console.log(`auth refresh, data ===>`, data)

              let { body } = data

              body['refresh_token'] = spotifyApi.getRefreshToken()
              spotifyApi.setAccessToken(body.access_token)

              writeAuthFile(body)
                .then(() => resolve())
            }, (err) => {
              console.log(`auth refresh failed?`, err)
            })
        }
      })
  })
}

function addToPlaylist (songURI = '') {
  if (songURI === '') return

  const fullTrackURI = `spotify:track:${songURI}`
  const user = 'ahermansson'
  const playlistId = `3fsvwkb2jmLCMU3znXyyNi`

  return new Promise((resolve, reject) => {
    probeAuth().then(() => {
      spotifyApi.addTracksToPlaylist(user, playlistId, [fullTrackURI])
        .then((data) => {
          resolve(data)
        }, (err) => {
          reject(err)
        })
    })
  })
}

export default addToPlaylist
