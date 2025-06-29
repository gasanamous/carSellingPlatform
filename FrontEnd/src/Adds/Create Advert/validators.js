const validators = {
    'Car model': model => /^[a-zA-Z][a-zA-Z0-9\s-]*[a-zA-Z0-9]$/.test(model) ? null : 'Please provide a valid car model ex(BMW X5, F-80, Q-8)',
    'Mileage': mileage => /^(?!.*\.$)\d+(\.\d+)?$/.test(mileage) ? null : 'Please provide a valid mileage number (ex: 0.5, 10.5)',
    'Engine capacity': capacity => /^\d+$/.test(capacity) ? null : 'Please provide a valid engine capacity',
    'Engine Cylinders': cylinders => /^\d+$/.test(cylinders) ? null : 'Please provide a valid engine cylinders number',
    'Fuel tank capacity': capacity => /^\d+(\.\d+)?$/.test(capacity) ? null : 'Please provide a valid Fuel tank capacity number, (ex: 83)',
    'Price': price => /^\d+$/.test(price) ? null : 'Please provide a valid price, (ex: 31999)',
}

export default validators