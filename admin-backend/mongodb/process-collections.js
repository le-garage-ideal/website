const mongoose = require('mongoose');
const { defineMongoDbSchema } = require('./mongodb.schema');
const { Car, Model, Brand } = defineMongoDbSchema(mongoose);

const updateBrands = async (filter, transform, async = false) => {

    const brands = await Brand.find(filter).exec();
    return await update(brands, transform, async);

};

const update = async (collection, transform, async) => {
    const results = [];
    for (let document of collection) {
        if (async) {
            await transform(document);
        } else {
            transform(document);
        }
        results.push(await document.save());
    }
    return results;
}

const updateModels = async (filter, transform, async = false) => {

    const models = await Model.find(filter).exec();
    return await update(models, transform, async);

};

const updateCars = async (filter, transform, async = false) => {

    const cars = await Car.find(filter).exec();
    return await update(cars, transform, async);

};

const createCars = async (filter, transform, async = false) => {

    const car = new Car.find(filter).exec();
    return await update(cars, transform, async);

};

const select = async (collection, transform) => {
    for (let document of collection) {
        transform(document);
    }
    return collection;
};

const selectBrands = async (filter, transform) => {

    const brands = await Brand.find(filter).exec();
    return select(brands, transform);

}

const selectModels = async (filter, transform) => {

    const models = await Model.find(filter).exec();
    return select(models, transform);

};

const selectCars = async (filter, transform) => {

    const cars = await Car.find(filter).exec();
    return select(cars, transform);

};

exports.Car = Car;
exports.Model = Model;
exports.Brand = Brand;
exports.updateBrands = updateBrands;
exports.updateModels = updateModels;
exports.updateCars = updateCars;
exports.createCars = createCars;
exports.selectBrands = selectBrands;
exports.selectModels = selectModels;
exports.selectCars = selectCars;
