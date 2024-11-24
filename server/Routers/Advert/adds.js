const express = require('express')
const AppError = require('../../AppError')
const { User } = require('../../Models/user')
const { Advertisement } = require('../../Models/advert')
const getCountryNameByCode = require('./countries')
const search = require('./search')
const favouriteController = require('./favoutireController')
const saveUserAdvertImages = require('./saveUserAdvertImages')
const addRouter = express.Router()

const isLoggedIn = (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).send('You must be logged in')
    }
    return next()
}

addRouter.post('/new_add', isLoggedIn, async (req, res) => {
    try {
        const { formData } = req.body
        const user = await User.findOne({ email: req.session.user.email })
        const newAdd = new Advertisement({
            location: user.city,
            user: user,
            post_date: getCurrentDate(),
            ...formData
        })
        await newAdd.save()
        return res.status(200).send({ successMessage: 'Your adverisement updated successfully' })
    }
    catch (error) {
        if (error.errors) {
            const validationErrors = error.errors;

            const errors = {};

            for (const key in validationErrors) {
                if (validationErrors.hasOwnProperty(key)) {
                    errors[capitalizeFirstLetter(key)] = validationErrors[key].message;
                }
            }
            console.log(errors)
            return res.status(422).send({ errors: errors })
        }
        return res.status(500).send('Sorry, an eror occured during edit your advertisement, please try again later')
    }
})
addRouter.post('/user/my/adds/edit/:addId', isLoggedIn, async (req, res) => {
    try {
        const { addId } = req.params

        const { formData } = req.body

        const updatedAdd = await Advertisement.findOneAndUpdate(
            { _id: addId },
            formData,
            { new: true, runValidators: true }
        );

        if (updatedAdd)
            return res.status(200).send({ successMessage: 'Your adverisement updated successfully' })

        return res.status(422).send({ errors: 'ERRRRRRRROR' })


    } catch (error) {
        if (error.errors) {
            const validationErrors = error.errors;

            const errors = {};

            for (const key in validationErrors) {
                if (validationErrors.hasOwnProperty(key)) {
                    errors[capitalizeFirstLetter(key)] = validationErrors[key].message;
                }
            }
            console.log(errors)
            return res.status(422).send({ errors: errors })
        }
        return res.status(500).send('Sorry, an eror occured during edit your advertisement, please try again later')
    }
})

addRouter.post('/user/delete/:addId', isLoggedIn, async (req, res) => {

    try {
        const { addId } = req.params

        const deleted = await Advertisement.deleteOne({ _id: addId })

        return res.status(202).send()

    } catch (error) {
        console.log(error)
        return res.status(500).send('Error while deleting advertisement')
    }
})

addRouter.post('/user/my', isLoggedIn, async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user.id)

        const allAdds = await Advertisement.find({})

        const myAdds = await Advertisement.find({ user: currentUser })

        const favs = await Advertisement.find({ favoutires_users: currentUser })

        return res.status(200).send([myAdds, favs])
    } catch (error) {
        console.log(error)
        return res.status(500).send('Server Error :: 500')
    }
})

addRouter.post('/list', async (req, res) => {
    if (Object.keys(req.query).length == 0) {
        try {
            const result = await Advertisement.find({})
            return res.status(200).send(result.reverse())
        } catch (error) {
            res.status(500).send(error.message)
        }
    }
    try {
        console.log('Query is ', req.query)
        const result = await search(req.query)
        res.status(200).send(result.reverse())
    } catch (error) {
        res.status(500).send('SERVER ERROR')
    }
})

addRouter.post('/search', async (req, res) => {

    try {
        const { searchFormData } = req.body
        const result = await search(searchFormData)
        res.status(200).send(result.reverse())

    } catch (error) {
        res.status(500).send('SERVER ERROR')
    }
})

addRouter.post('/getById/:addId', async (req, res) => {
    try {
        const { addId } = req.params
        //const advertisement = await Advertisement.findById(addId, {_inquires: 0, user: 0, favoutires_users: 0});

        const add = await await Advertisement.findById(addId, { inquiries: 0, user: 0, favoutires_users: 0 });

        if (!add) {
            throw new AppError('PAGE_NOT_FOUND', 404)
        }

        const carCompany = add.carManufacturer;

        const otherAdds = await Advertisement.find({ _id: { $ne: addId }, carManufacturer: carCompany });

        let isFavourited = false
        if (req.session.user) {
            const usersFavouritesThisAdd = await Advertisement.find({ _id: addId, favoutires_users: { $in: [req.session.user.id] } }, { favoutires_users: 1, _id: 0 })
            isFavourited = usersFavouritesThisAdd.length == 1
        }
        return res.status(200).send({
            data: {
                add: add,
                suggestedAdds: otherAdds,
                isFavourited: isFavourited
            }
        })

    } catch (error) {
        console.log(error)
        if (error instanceof AppError)
            return res.status(error.status).send(error.error_data)
    }
    return res.status(500).send('Error with connection with server')
})

addRouter.post('/:carManufacturer/list', async (req, res) => {
    const { carManufacturer } = req.params
    const result = await Advertisement.find({ carManufacturer: carManufacturer })
    console.log(result.length)
    res.status(200).send(result.reverse())
})

addRouter.post('/addToFavourites', isLoggedIn, async (req, res) => {
    const { addId, isFavourited } = req.body

    try {

        let proccess_result = await favouriteController(addId, isFavourited, req.session.user.id)

        if (!proccess_result[0]) {
            throw new AppError('Error while proccess', 422)
        }
        return res.status(200).send(proccess_result[1])

    } catch (error) {
        console.log(error)
        if (error instanceof AppError)
            return res.status(error.status).send(error.message)
        return res.status(500).send()
    }
})

addRouter.post('/send_inquire', async (req, res) => {
    const { inquire, addId } = req.body
    console.log(inquire)
    try {

        const add = await Advertisement.findById(addId)

        const newInq = {
            firstname: capitalizeFirstLetter(inquire.firstname),
            lastname: capitalizeFirstLetter(inquire.lastname),
            email: inquire.email.toLowerCase(),
            phoneNumber: inquire.phoneNumber,
            message: inquire.message,
            sent_date: getCurrentDateTime()
        }

        add.inquiries.push(newInq)
        await add.save()

        return res.status(200).send({ successMessage: `All done ${newInq.firstname}, your message sent successfully` })

    } catch (error) {
        console.log(error)

        return res.status(500).send({ errors: 'Sorry, an error occured while sending your message, try again' })
    }
})

function getCurrentDateTime() {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const currentDate = new Date();

    const day = String(currentDate.getDate()).padStart(2, '0')
    const month = months[currentDate.getMonth()].substring(0, 3)
    const year = currentDate.getFullYear()
    let hours = currentDate.getHours()
    const amPm = hours >= 12 ? 'PM' : 'AM'
    hours = hours % 12 || 12
    const minutes = String(currentDate.getMinutes()).padStart(2, '0')

    return `${day} ${month} ${year} - ${hours}:${minutes} ${amPm}`
}


function getCurrentDate() {

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = months[currentDate.getMonth()];
    const year = currentDate.getFullYear();

    return `${day} ${month} ${year}`;
}

function splitByCapitalLetter(attributeName) {
    let words = attributeName.replace(/([a-z])([A-Z])/g, '$1 $2').split(' ');
    words = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
    return words.join(' ');
}

function capitalizeFirstLetter(str) {
    str = splitByCapitalLetter(str).toLowerCase()
    if (str.length === 0) {
        return str;
    } else {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

module.exports = addRouter



