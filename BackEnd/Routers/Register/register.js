const express = require('express')
const signup = express.Router()
const checkExistence = require('./userExistenceCheck')
const createAndStoreUser = require('./createAndStoreUser')
const nodemailer = require('nodemailer')
const AppError = require('../../AppError')
const { User } = require('../../Models/user')

signup.post('/', async (req, res) => {
    try {
        const { email, phoneNumber } = req.body.formData

        const userExistence = await checkExistence(email, phoneNumber)

        if (Object.entries(userExistence).length != 0) {
            return res.status(422).send({ errors: userExistence })
        }
        const result = await createAndStoreUser(req.body.formData)

        if (result instanceof AppError) {
            return res.status(422).send({ errors: result.error_data })
        }
        const successMessage = `Welcome ${result.firstname} ${result.lastname}, you has been registered successfully`
        return res.status(201).send({successMessage : successMessage})
    }
    catch (error) {
        console.log(error)
        return res.status(500).send(error.message)
    }
})


signup.post('/upload', async (req, res) => {
    try {
        if (req.session.user) {
            const { username } = req.session.user
            console.log(req.body.profimg)
            await User.findOneAndUpdate({ username: username }, { profile_img: req.body.profimg }, { new: true })
            return res.status(200).send('PHOTO IT SET')
        }
        else {
            res.status(401).send()
        }
    } catch (error) {
        return res.status(422).send()
    }

})

signup.get('/active/:token', async (req, res) => {
    if (!req.session.verifySession) {
        return res.status(401).redirect('http://localhost:5173/user/signin')

    }
    const { token } = req.params
    console.log('token is : ', token)
    const user = await User.findOne({ token: token })
    user.status = 'active'
    await user.save()
    req.session.verifySession = null
    return res.status(200).redirect('http://localhost:5173/user/signin?activate=true')
})

module.exports = signup