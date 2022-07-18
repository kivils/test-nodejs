/**
 * Get Main page
 * @param req
 * @param res
 */
exports.getMainPage = (req, res) => {
  res.render(
    'index',
      {
        path: '/',
        pageTitle: 'Home page',
        isLogged: req.session.isLogged
      }
  );
}

/**
 * Get 404 page
 * @param req
 * @param res
 */
exports.getPageNotFound = (req, res) => {
  res
    .status(404)
    .render(
      '404',
      {
        path: '',
        pageTitle: 'Page not found',
        isLogged: req.session.isLogged
      }
    );
}
