const passport = require("passport");

module.exports = (req, res, next) => {
  if (req.isAuthenticated()) return next();

  passport.authenticate("local", (err, user) => {
    if (err) return next(err);
    if (!user) return res.status(400).json({ msg: "Missing credentials!" });

    req.logIn(user, err => {
      if (err) return next(err);
      return next();
    });
  })(req, res, next);
};
