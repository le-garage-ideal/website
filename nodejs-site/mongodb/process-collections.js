import mongoose from 'mongoose';

import defineMongoDbSchema from './mongodb.schema.js';

export const {Car, Model, Brand} = defineMongoDbSchema(mongoose);

export async function updateBrands(filter, transform, async = false) {

    const brands = await Brand.find(filter).exec();
    return await update(brands, transform, async);

}

export async function updateModels(filter, transform, async = false) {

    const models = await Model.find(filter).exec();
    return await update(models, transform, async);

}

export async function updateCars(filter, transform, async = false) {

    const cars = await Car.find(filter).exec();
    return await update(cars, transform, async);

}

async function update(collection, transform, async) {
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


export async function selectBrands(filter, transform) {

    const brands = await Brand.find(filter).exec();
    return select(brands, transform);

}

export async function selectModels(filter, transform) {

    const models = await Model.find(filter).exec();
    return select(models, transform);

}

export async function selectCars(filter, transform) {

    const cars = await Car.find(filter).exec();
    return select(cars, transform);

}

async function select(collection, transform) {
    for (let document of collection) {
        transform(document);
    }
    return collection;
}

