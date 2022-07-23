module.exports = ((req, res, next) => {
  if(!req.session.isLogged) {
    res.redirect('/users/login');
  }

  next();
});
