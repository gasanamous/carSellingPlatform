const AppError = require('../../AppError');
const { User } = require('../../Models/user')
const bcrypt = require('bcrypt')
const { v4: uuid } = require('uuid');

const createAndStoreUser = async (data) => {
    try {
        data = {
            ...data,
            password: await cryptPassword(data.password),
            email: data.email.toLowerCase(),
            firstname: capitalizeFirstLetter(data.firstname),
            lastname: capitalizeFirstLetter(data.lastname),
            city: capitalizeFirstLetter(data.city),
            phoneNumber : data.phoneNumber
        }
        console.log(data)

        //const newUser = new User({ ...data, token: uuid() })

        //const result = await newUser.save()
        return await new User( { ...data, token: uuid() }).save()
        //return result

    } catch (error) {
        if (error.errors) {
            const errorsMessages = {}
            Object.entries(error.errors).forEach(([key, value]) => {
                errorsMessages[capitalizeFirstLetter(key)] = value.properties.message
            })
            return new AppError( 422, errorsMessages)
        }
        
        return new AppError( 500, error.message)
    }
}

const cryptPassword = async (plainText) => {
    if (plainText == '' || plainText.length < 8) return plainText
    return await bcrypt.hash(plainText, 12)
}



function capitalizeFirstLetter(word) {
    if (!word) return '';
    word = word.toLowerCase()
    return word.charAt(0).toUpperCase() + word.slice(1);
}

module.exports = createAndStoreUser




