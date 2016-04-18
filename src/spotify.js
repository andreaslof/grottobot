import app from './spotify/server';
import config from './spotify/config';

const { host, port } = config;

app.listen(port, host, (error) => {

  if (error) {

    console.error(`couldn't boot server`, error);
    process.exit(10);

  }

  console.log('Grottobot Spotify app listening at http://%s:%s', host, port);

});
