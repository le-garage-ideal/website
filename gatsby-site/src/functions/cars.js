export const eachCarIndex = fn => {
    const result = []; 
    for (let i = 0; i < 3; i++) {
        result.push(fn(i));
    }
    return result;
}

export const eachCar = fn => {
    return eachCarIndex(i => fn(`car${i+1}`, i));
}

export const fullname = car => `${car.model.brand.name} ${car.variant}`;
