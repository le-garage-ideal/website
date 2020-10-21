const { mongodb } = require('../passwords');

const connectToMongoDb = async (mongoose) => {

    //Set up default mongoose connection
    mongoose.connect(mongodb, { useNewUrlParser: true, useUnifiedTopology: true });

    //Get the default connection
    var db = mongoose.connection;

    //Bind connection to error event (to get notification of connection errors)
    db.on('error', error => { console.error(error); process.exit(-1); });

    return db;

};

exports.connectToMongoDb = connectToMongoDb;
