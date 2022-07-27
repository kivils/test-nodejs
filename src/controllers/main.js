/**
 * Get Main page
 * @param req
 * @param res
 */
exports.getMainPage = (req, res) => {
  // flash format: ('error',  ['string1', 'string2', ...])
  let errorMessage = req.flash('error');
  let successMessage = req.flash('success');

  if(errorMessage.length > 0) {
    errorMessage = errorMessage[0];
  }
  else {
    errorMessage = null;
  }

  if(successMessage.length > 0) {
    successMessage = successMessage[0];
  }
  else {
    successMessage = null;
  }

  res.render(
    'index',
      {
        path: '/',
        pageTitle: 'Home page',
        successMessage: successMessage,
        errorMessage: errorMessage
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
