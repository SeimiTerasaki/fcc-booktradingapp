var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// create User Schema
var User = new Schema({
  username: String,
  email: { type: String, default: 'None' },
  password: { type: String, default: 'None' },
  address:{ type: String, default: 'None' },
  pendingrequests:{ type : Array , default : [] },
  myrequests:{ type : Array , default : [] },
  books:{ type : Array , default : [] }
});

module.exports = mongoose.model('user', User);