export default function defineMongoDbSchema(mongoose) {

    // Define schema
    const Schema = mongoose.Schema;

    const carSchema = new Schema({
        variant: String,
        power: Number,
        officialWeight: Number,
        weight: Number,
        options: String,
        startYear: String,
        endYear: String,
        model: { name: String, brand: { name: String } },
        favcarsVariants: [{ name: String, urls: [String] }]
        // model: { type: Schema.Types.ObjectId, ref: 'Model' },
    });

    const modelSchema = new Schema({
        name: String,
        brand: { name: String },
        favcarsName: String,
        // brand: { type: Schema.Types.ObjectId, ref: 'Brand' },
        // cars: [{ type: Schema.Types.ObjectId, ref: 'Car' }]
    });

    const brandSchema = new Schema({
        name: String,
        imageUrl: String,
        image: String,
        favcarsName: String,
        // models: [{ type: Schema.Types.ObjectId, ref: 'Model' }],
    });

    // Compile model from schema
    const Car = mongoose.model('Car', carSchema);
    const Model = mongoose.model('Model', modelSchema);
    const Brand = mongoose.model('Brand', brandSchema);

    return {Car, Model, Brand};
}
