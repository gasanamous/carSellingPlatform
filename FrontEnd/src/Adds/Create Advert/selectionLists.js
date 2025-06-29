const selectionLists = {
    health: ['Good', 'Excellent', 'Toast'].sort(),
    companies: ["Acura", "Aston Martin", "Audi", "Bentley", "BMW", "Bugatti", "Cadillac", "Chery", "Chevrolet", "Dodge", "Ferrari", "Fiat", "Ford", "Genesis", "GMC", "Honda", "Hummer", "Hyundai", "Hutchinson", "Jaguar", "Jeep", "Kia", "Lada", "Land Rover", "Lexus", "Lincoln", "Lotus", "Maserati", "Mazda", "Mercedes-Benz", "Mitsubishi", "Nissan", "Pontiac", "Porsche", "Renault", "Rolls-Royce", "Saab", "SEAT", "Skoda", "Smart", "Subaru", "Suzuki", "Tata", "Tesla", "Toyota", "Volkswagen", "Volvo"].sort(),
    years: Array.from({ length: 45 }, (_, i) => (2024 - i).toString()),
    previousUse: ['Rental', 'Goverment', 'Private', 'Taxi'].sort(),
    colors: ['Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple', 'Pink', 'Cyan', 'Magenta', 'Teal', 'Brown', 'Black', 'Gray', 'White'].sort(),
    drivetrain: ['Front-wheel Drive', 'Rear-wheel Drive', '4-wheel Drive'].sort(),
    fuelType: ['Gasoline', 'Diesel', 'Electric', 'Hybrid', 'Hydrogen'].sort(),
    addonsList : ['Sensors','Steering Control','Screen','Fuel Saving System','Keyless Entry','Electric Handbrake','Power Folding Mirrors','Seat Heating','Parking Assistance','Lane Departure Warning','Tow Hook','Cruise Control','Sunroof','Electric Seats','Electric Trunk','Steering Heating',]
}
export default selectionLists