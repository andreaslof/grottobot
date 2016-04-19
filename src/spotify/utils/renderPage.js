import template from 'lodash.template';

import htmlStr from '../../views/html/index.tmpl.js';

function wrapPage (data={}) {

  const wrap = template(htmlStr);

  return wrap(data);

}

function renderPage (tmpl, vars={}) {

  const tmplStr = require(`../../views/${tmpl}/index.tmpl.js`).default;
  const pageTitle = vars.pageTitle;
  const page = template(tmplStr);
  const data = {
    pageTitle,
    content: page(vars)
  };

  return wrapPage(data);

}

export default renderPage;
