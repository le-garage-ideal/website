import { mongodbPassword } from '../passwords.js';

export default async function connectToMongoDb(mongoose) {

    //Set up default mongoose connection
    var mongoDB = `mongodb://uepch5uqblw5mad6k1x1:${mongodbPassword}@bmbu7ynqra11rqi-mongodb.services.clever-cloud.com:27017/bmbu7ynqra11rqi`;
    mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

    //Get the default connection
    var db = mongoose.connection;

    //Bind connection to error event (to get notification of connection errors)
    db.on('error', error => { console.error(error); process.exit(-1); });

    return db;

}