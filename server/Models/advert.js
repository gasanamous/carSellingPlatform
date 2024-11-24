const mongoose = require('../db')
const { User } = require('./user')

const Advertisement = mongoose.model('Advertisement', new mongoose.Schema({
    user: { required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    post_date: { required: true, type: String },
    location: { type: String, required: true },
    carManufacturer: { type: String, required: [true, 'Car manufacturer is required'] },
    carModel: { type: String, default: '', required: [true, 'Model is required'] },
    productionYear: { type: String, required: [true, 'Production year is required'] },
    previousUse: { type: String, required: [true, 'Previous use is required'] },
    transmission: { type: String, required: [true, 'Transmission is required'] },
    mileage: { type: Number, required: [true, 'Mileage is required'] },
    carHealth: { type: String, required: [true, 'Car health is required'] },
    outerColor: { type: String, required: false },
    upholstery: { type: String, required: false },
    engineCapacity: { type: Number, required: [true, 'Engine Capacity is required'] },
    engineCylinders: { type: Number, required: [true, 'Engine Cylinders number is required'] },
    drivetrainPower: { type: String, required: [true, 'Drivetrain power is required'] },
    fuelType: { type: String, required: [true, 'Fuel type is required'] },
    fuelTankCapacity: { type: Number, required: [true, 'Tank capacity is required'] },
    licenseExpiry: String,
    price: { type: Number, required: [true, 'Price is required'] },
    carImages: {
        type: [String],
        validate: {
            validator: function (images) {
                return images && images.length > 0;
            },
            message: 'Car images is required'
        }
    },
    addons: [String],
    notes: String,
    inquiries: [{
        firstname: { type: String, required: false },
        lastname: { type: String, required: false },
        email: { type: String, required: false },
        phoneNumber: { type: String, required: false },
        message: { type: String, required: false },
        sent_date: { type: String, required: false },
    }],
    favoutires_users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}));
module.exports = { Advertisement }