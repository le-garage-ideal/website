import mongoose from 'mongoose';
// Define schema
const Schema = mongoose.Schema;

const carSchema = new Schema({
    variant: String,
    power: Number,
    officialWeight: Number,
    weight: Number,
    options: String,
    startDate: Date,
    model: { type: Schema.Types.ObjectId, ref: 'Model' },
});

const modelSchema = new Schema({
    name: String,
    brand: { type: Schema.Types.ObjectId, ref: 'Brand' },
    cars: [{ type: Schema.Types.ObjectId, ref: 'Car' }]
});

const brandSchema = new Schema({
    name: String,
    models: [{ type: Schema.Types.ObjectId, ref: 'Model' }],
});

// Compile model from schema
export const Car = mongoose.model('Car', carSchema);
export const Model = mongoose.model('Model', modelSchema);
export const Brand = mongoose.model('Brand', brandSchema);

