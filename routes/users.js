let mongoose = require('mongoose');
let plm = require('passport-local-mongoose');

let url = process.env.MONGO_URI || 'mongodb+srv://pratik:kitarp@pratik.7m6lk.mongodb.net/LinkedIn?retryWrites=true&w=majority'

mongoose.connect(url)
.then(function(){
  console.log('Database connected')
})
.catch(function(e){
  console.log(e)
})

let UserSchema = mongoose.Schema({
  username : String,
  password: String,
  number : String
})

UserSchema.plugin(plm)

module.exports = mongoose.model('user', UserSchema)