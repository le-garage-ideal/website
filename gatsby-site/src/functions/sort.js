const sortCars = (x, y) => {
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
    if (a[field] === b[field]) {
      return 0;
    }
    return a[field] < b[field] ? -1 : 1;
  };
  return sortField(x, y, 'startYear') === 0 ? sortField(x, y, 'variant') : sortField(x, y, 'startYear');
};

export default sortCars;
