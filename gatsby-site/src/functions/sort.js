
const sortCars = (a, b) => {
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
    return sortField(a, b, 'startYear') === 0 ? sortField(a, b, 'variant') : sortField(a, b, 'startYear');
};

export default sortCars;
