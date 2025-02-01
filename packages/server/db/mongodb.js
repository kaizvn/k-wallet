import mongoose from 'mongoose';
import mongooseLong from 'mongoose-long';

mongooseLong(mongoose);
//mongoose.set('debug', true);

const {
  MONGO_REPLICA_URL,
  MONGO_URL,
  MONGO_DB,
  NODE_ENV,
  MONGO_OPTIONS
} = process.env;

const mongoUrl = MONGO_REPLICA_URL || MONGO_URL || 'mongodb://localhost:27017';
const dbName = MONGO_DB || 'SmartCity';

const options = MONGO_OPTIONS
  ? JSON.parse(MONGO_OPTIONS)
  : { useNewUrlParser: true };

options.dbName = dbName;

console.log(mongoUrl + '/', options);

module.exports = mongoose
  .connect(mongoUrl + '/', options)
  .then((resp) => {
    if (NODE_ENV !== 'test' && resp) {
      console.log('mongo is running on: ', mongoUrl);
      console.log('mongodb connected successfully');
    }

    return mongoose;
  })
  .catch((error) => {
    console.error(error);
    process.exit();
  });
