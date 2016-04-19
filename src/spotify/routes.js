import home from './home';
import auth from './auth';
import authBack from './auth-back';

export const redirectUri = `/auth/back`;

export default function (app) {

  app.get(`/`, home);
  app.get(`/auth`, auth);
  app.get(`/auth/back`, authBack);

};
