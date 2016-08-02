var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');

var sendJsonResponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.register = function(req, res){
  if(!req.body.name || !req.body.email || !req.body.password){
    return sendJsonResponse(res, 400, 'All fields required');
  }

  var user = new User();
  user.name = req.body.name;
  user.email = req.body.email;
  user.setPassword(req.body.password);
  user.admin = false;

  user.save(function(err){
      if(err){
        return sendJsonResponse(res, 400, err);
      }
      sendJsonResponse(res, 200, user.generateJWT());
  });
}

module.exports.login = function(req, res){
  if(!req.body.email || !req.body.password){
    return sendJsonResponse(res, 400, 'All fields required');
  }

  passport.authenticate('local', function(err,user,info){
      if(err){
        return sendJsonResponse(res, 400, err);
      }

      if(user){
        sendJsonResponse(res, 200, user.generateJWT());
      } else {
        sendJsonResponse(res, 401, info);
      }
  })(req,res);
}
