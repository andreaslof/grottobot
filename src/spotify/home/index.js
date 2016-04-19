import renderPage from '../utils/renderPage';

function html (params={}) {

  return renderPage('Home', {
    pageTitle: 'Home',
    test: `this is us testing rendering`
  });

}

function home (req, res) {

  res.send(html(req.query));

}

export default home;
