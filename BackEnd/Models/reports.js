const mongoose = require('../db')

const Report = mongoose.model('Report', new mongoose.Schema({
    firstname: {
        required: [true, 'Firstname is required'],
        type: String
    },
    lastname: {
        required: [true, 'Lastname is required'],
        type: String
    },
    email: {
        required: [true, 'Email is required'],
        type: String
    },
    problemSubject: {
        required: [true, 'Problem subject is required'],
        type: String
    },
    additionalDetails: {
        required: [true, 'Additional details is required'],
        type: String
    },
    status: {
        type: String,
        default: 'in proccess'
    },
    feedback: {
        type: String,
        default: ''
    },
    submissionDate: String
}))

module.exports = Report