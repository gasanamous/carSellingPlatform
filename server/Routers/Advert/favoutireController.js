const { Advertisement } = require('../../Models/advert')
const { User } = require('../../Models/user')

const favouriteController = async (addId, isFavourited, userId) => {

    try {

        const user = await User.findById(userId);

        let result = false
        let proccess_name = ''
        if (!isFavourited) {
            result = await Advertisement.findOneAndUpdate(
                { _id: addId },
                { $addToSet: { favoutires_users: userId } },
                { new: true }
            )
            proccess_name = 'Added'
        }
        else {
            result = await Advertisement.findOneAndUpdate(
                { _id: addId },
                { $pull: { favoutires_users: userId } },
                { new: true }
            )
            proccess_name = 'Removed'
        }

        return [result,proccess_name]

    } catch (error) {
        console.log('ERROR IN PROCCESS:' ,error)
        return [null, null]
    }
}

module.exports = favouriteController

