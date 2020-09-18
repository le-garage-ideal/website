

const sortField = (a, b, field) => {
    if (!a[field] && !b[field]) {
        return 0;
    }
    if (!a[field]) {
        return -1;
    }
    if (!b[field]) {
        return 1;
    }
    return a[field] < b[field] ? -1 : a[field] === b[field] ? 0 : 1;
};

export const sortBrands = (a, b) => {
    return sortField(a, b, 'name');
};

export const sortModels = (a, b) => {
    return sortField(a, b, 'name');
};
