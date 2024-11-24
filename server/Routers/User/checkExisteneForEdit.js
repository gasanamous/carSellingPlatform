const { User } = require('../../Models/user')


const checkExisteneForEdit = async (phoneNumber) => {
    
    const error = {}
    if (await User.findOne({ phoneNumber: phoneNumber })) {
        error['Phone number'] = 'This phone number is already used from another account'
    }
    return error
}

module.exports = checkExisteneForEdit