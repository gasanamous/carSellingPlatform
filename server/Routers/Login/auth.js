const { User } = require('../../Models/user')
const bcrypt = require('bcrypt')

const auth = async (email, password) => {
    
    const user = await User.findOne({ email: email })

    if (!user) 
        return null

    if (!await bcrypt.compare(password, user.password))
        return null
    return user
}

module.exports = auth