import mongoose from 'mongoose';
import { Car, Model, Brand } from './mongodb.schema.js';

async function main() {

    //Set up default mongoose connection
    var mongoDB = 'mongodb://uepch5uqblw5mad6k1x1:BN5Ufr4twpbJqZjdshDr@bmbu7ynqra11rqi-mongodb.services.clever-cloud.com:27017/bmbu7ynqra11rqi';
    mongoose.connect(mongoDB, { useNewUrlParser: true });

    //Get the default connection
    var db = mongoose.connection;

    //Bind connection to error event (to get notification of connection errors)
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));

    const brands = await Brand.find({ name: /^.+\s$/ });
    let brandsModified = brands.reduce(trimBrandName, 0);
    console.log(brandsModified + ' brands modified')

    const cars = await Car.find({ variant: /205/ }).populate({
        path: 'model',
        populate: { path: 'brand'} 
    });

    cars.forEach(car => {
        console.log(car.model.brand.name, car.model.name, car.variant);
    });

}

async function trimBrandName(brandModifieds, brand) {
    const {brandModified} = await Brand.updateOne({ name: brand.name }, { name: brand.name.trim() });
    return brandModifieds + brandModified;
}

function handleError(error) {
    console.err(error);
    return -1;
}