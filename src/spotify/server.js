import fs from 'fs'
import express from 'express'
import SpotifyWebApi from 'spotify-web-api-node'

import routes, { redirectUri } from './routes'
import config from './config'

const clientId = process.env.SPOTIFY_CLIENT_ID
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET

if (!clientId || !clientSecret) {
  console.log('no spotify api client details found')
  process.exit(1)
}

const app = express()
const spotifyApi = new SpotifyWebApi({ clientId, clientSecret })

try {
  const spotAuth = JSON.parse(fs.readFileSync(`${process.cwd()}/.spotauth`))

  spotifyApi.setAccessToken(spotAuth.access_token)
  spotifyApi.setRefreshToken(spotAuth.refresh_token)
} catch (e) {
}

function writeAuthFile (data) {
  const authFile = `${process.cwd()}/.spotauth`
  data = JSON.stringify(data)
  console.log(data)

  return new Promise((resolve, reject) => {
    fs.writeFile(authFile, data, (err) => {
      if (err) {
        console.error(`write file failed`, err)
        reject(err)
      }

      resolve()
    })
  })
}

app.set('x-powered-by', false)

app.use((req, res, next) => {
  const { protocol, hostname } = req
  console.log(protocol, hostname)

  if (!spotifyApi.getRedirectURI()) {
    spotifyApi.setRedirectURI(`${protocol}://${hostname}:${config.port}${redirectUri}`)
  }

  next()
})

app.use(redirectUri, (req, res, next) => {
  const { code } = req.query

  spotifyApi.authorizationCodeGrant(code)
    .then((authData) => {
      writeAuthFile(authData.body)
        .then(() => {
          res.redirect(`/?auth=done`)
        }, (err) => {
          console.log('error on auth', err)
          res.redirect(`/auth`)
        })
    }, (err) => {
      console.log('error on auth', err)
      res.redirect(`/auth`)
    })
})

routes(app)

export default app
export { spotifyApi, writeAuthFile }
