var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var userSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true
  },
  email:{
    type: String,
    required: true,
    unique: true
  },
  hash: String,
  salt: String,
  admin: Boolean
});

userSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
}

userSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
  return this.hash === hash;
};

userSchema.methods.generateJWT = function(){
  expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate()+7);

  return jwt.sign({
    _id: this._id,
    email: this.email,
    name: this.name,
    admin: this.admin
  },process.env.JWT_SECRET);
}

mongoose.model('User', userSchema);
