import home from './home';
import auth from './auth';

export default function (app) {

  app.get(`/`, home);
  app.get(`/auth`, auth);

};
