/**
 * Get Main page
 * @param req
 * @param res
 */
exports.getMainPage = (req, res) => {
  // flash format: ('error',  ['string1', 'string2', ...])
  let success = req.flash('success');

  if(success.length > 0) {
    successMessage = success[0];
  }
  else {
    successMessage = null;
  }

  res.render(
    'index',
      {
        path: '/',
        pageTitle: 'Home page',
        successMessage: successMessage
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
        pageTitle: 'Page not found'
      }
    );
}
