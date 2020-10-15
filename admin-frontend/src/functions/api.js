import { BASE_URL } from '../config';

export const fetchInitData = () => {
    return Promise.all([
        fetch(BASE_URL + '/cars').then(res => res.json()),
        fetch(BASE_URL + '/brands').then(res => res.json()),
        fetch(BASE_URL + '/models').then(res => res.json())
    ]).then(processInitData);
}

function processInitData ([cars, brands, models]) {
    const modelMap = {};
    const brandMap = {};
    for (const car of cars) {

        const brand = brands.find(brand => brand.name === car.model.brand.name);
        if (!brand) {
            console.log(`brand not found for car`, car);
        } else {
            if (!brandMap[brand._id]) brandMap[brand._id] = { totalCount: 0, okCount: 0 };
            brandMap[brand._id].totalCount++;
            if (car.selectedFavcarsUrl) {
                brandMap[brand._id].okCount++;
            }
        }

        const model = models.find(model => model.brand.name === car.model.brand.name && model.name === car.model.name);
        if (!model) {
            console.log(`model not found for car`, car);
        } else {
            if (!modelMap[model._id]) modelMap[model._id] = { totalCount: 0, okCount: 0 };
            modelMap[model._id].totalCount++;
            if (car.selectedFavcarsUrl) {
                modelMap[model._id].okCount++;
            }
        }
    }
    return { cars, models, brands, brandMap, modelMap };
}

