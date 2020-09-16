const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
let isConnected;

const DB_URL = process.env.MONGODB_URI;

const connectDatabase = () => {
  if (isConnected) {
    // console.info('already connected. using existing connection');
    return Promise.resolve();
  }

  console.info('connecting to database');
  return mongoose
    .connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((db) => {
      isConnected = db.connections[0].readyState;
    });
};

module.exports = connectDatabase;
