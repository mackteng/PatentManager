var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

var localStrategy = new LocalStrategy({usernameField : 'email'}, function(username,password,done){
  User.findOne({email: username},function(err, user){
    if(err) return done(err);
    if(!user || !user.validPassword(password)) return done(null, false, {message: 'Invalid Username/Password'});
    return done(null, user);
  });
});

passport.use(localStrategy);
