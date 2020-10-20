export const errorToMessage = error => {
    if (error) {
        switch (error.type) {
            case 'required': return 'Field is mandatory';
            case 'pattern': return 'Field should be a number';
            default: return '';
        }
    }
    return '';
};
