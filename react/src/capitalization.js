function splitByCapitalLetter(attributeName) {
    let words = attributeName.replace(/([a-z])([A-Z])/g, '$1 $2').split(' ');
    words = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
    return words.join(' ');
}

function capitalizeFirstLetter(str) {
    str = splitByCapitalLetter(str).toLowerCase()
    if (str.length === 0) {
        return str;
    } else {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

export default capitalizeFirstLetter