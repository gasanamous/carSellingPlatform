const mongoose = require('../db')

const userSchema = new mongoose.Schema({
    firstname: {
        required: [true, 'Firstname is required'],
        type: String
    },
    lastname : {
        required: [true, 'Lastname is required'],
        type: String
    },
    email: {
        unique: [true, 'Email already used'],
        required: [true, 'Email is required'],
        type: String
    },
    password: {
        required: [true, 'Password is required'],
        type: String,
        minlength: [8, 'Password length must be at least 8 characters']
    },
    city: {
        type: String,
        required: [true, 'City is required']
    },
    phoneNumber: {
        unique: [true, 'Phone number already used'],
        type: String,
        required: [true, 'Phone number is required'],
        minlength: [8, 'Please provide a valid phone number (ex: 05XXXXXXXX)']
    },
    profile_img: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        default: 'suspended'
    },
    token: {
        required: true,
        type: String,
        unique: true
    },
    role: {
        type: String,
        enum: ['admin', 'customer'],
        default: 'customer'
    },
    isLoggedIn : {
        type : Boolean,
        default : false
    },
})
const User = mongoose.model('User', userSchema)


module.exports = { User }