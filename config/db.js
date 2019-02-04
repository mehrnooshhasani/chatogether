const mongoose = require('mongoose');

const dbURI = 'mongodb://mehrnoush:mehmeh5@ds063178.mlab.com:63178/chatwithme';

mongoose.Promise = global.Promise;

const connect = () => {
  mongoose.connect(dbURI);
};

// Connect to mongo host, set retry on initial fail
const connectMongo = () => {
  connect();
  // CONNECTION EVENTS
  mongoose.connection.on('connected', () => {
    console.log(`Mongoose connected`);
  });

  mongoose.connection.on('error', err => {
    console.log(`Mongoose connection error: ${err}`);
    setTimeout(connect, 4000);
  });
};

module.exports = {
  connectMongo
};
