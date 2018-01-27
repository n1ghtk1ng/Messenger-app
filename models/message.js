var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('./user');
var schema = new Schema({
    content: {type: String, required: true},
    user: {type: Schema.Types.ObjectId, ref: 'User'}
});
schema.post('remove',function (message) { // whenever a message is removed .. , then this function is executed
   User.findById(message.user, function (err,user) {
       user.messages.pull(message);
       user.save();
   })
});

module.exports = mongoose.model('Message', schema);