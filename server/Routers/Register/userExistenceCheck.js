const { User } = require('../../Models/user')


const checkExistence = async (email, phoneNumber) => {
    const error = {}

    email = email.toLowerCase()
    
    if ((await User.findOne({ email: email })))
        error['Email'] = 'This email is already registered, please type another email'

    if ((await User.findOne({ phoneNumber: phoneNumber }))) {
        error['Phone number'] = 'Phone number is already used from another account'
    }

    return error
}

module.exports = checkExistence