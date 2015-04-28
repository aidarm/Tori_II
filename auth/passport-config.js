module.exports = function() {
  var passport = require('passport');
  var passportLocal = require('passport-local');
  var userService = require('../services/user-service');
  var bcrypt = require('bcrypt');
  var validator = require('validator');
  var Recaptcha = require('recaptcha-verify');
  
  var recaptcha = new Recaptcha({
      secret: '6Leo6AUTAAAAAKJ6Tc7R3G9aRxkZPN4ouNog85KJ'
  });
  
  passport.use(new passportLocal.Strategy({usernameField: 'email', passReqToCallback: true}, function(req, email, password, next) {

    var response = req.body.response;
    recaptcha.checkResponse(response, function(err, response){
      if(err || !response.success 
             || !validator.isEmail(email) 
             || !validator.isAlphanumeric(password) 
             || !validator.isLength(password, 6, 12)) 
        return next(err);
    });

    userService.findUser(email, function(err, user) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return next(null, null);
      }
      
      bcrypt.compare(password, user.password, function(err, same){
        if (err) {
          next(err);
        }
        if (!same) {
          return (null, null);
        }
        next(null, user);
      });
    });
  }));
  
  passport.serializeUser(function(user, next) {
    next(null, user.email);
  });
  
  passport.deserializeUser(function(email, next) {
    userService.findUser(email, function(err, user) {
      next(err, user);
    });
  });
};