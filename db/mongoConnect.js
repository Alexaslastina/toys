const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://amir:amirham@cluster0.qkgsu.mongodb.net/panda4', {useNewUrlParser: true, useUnifiedTopology: true});


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log("mongo connect");
  // we're connected!
});

module.exports = db;