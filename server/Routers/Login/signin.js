const express = require('express')
const auth = require('./auth')
const AppError = require('../../AppError')
const sendMail = require('./sendToken')
const { User, UserToken } = require('../../Models/user')
const bcrypt = require('bcrypt')
const signin = express.Router()
const { v4: uuid } = require('uuid')
const IPs = require('../../config')

signin.post('/', async (req, res) => {
    
    try {
        let { email, password } = req.body
        
        email = email.toLowerCase()

        const user = await auth(email, password)

        if (!user)
            return res.status(401).send('Incorrent email or password')

        if (user.status == 'suspended') {
            req.session.verifySession = {userId : user._id}
            return res.status(423).send(user._id)
        }

        req.session.user = {
            id: user.id,
            email: user.email,
            profile_img: user.profile_img,
            name : `${user.firstname} ${user.lastname}`,
            role: user.role
        }

        user.isLoggedIn = true
        await user.save()
        return res.status(200).send(req.session.user)
        
    } catch (error) {
        console.log(error.message)
        res.status(500).send(error.message)
    }

})

signin.post('/verify', async (req, res) => {
    try {
        if (!req.session.verifySession) 
            return res.status(401).send()

        const {userId} = req.session.verifySession
        const user = await User.findById(userId, { email: 1, token: 1 })

        if (!user) {
            return res.status(401).send('401 :: Incorrect email or password')
        }

        const subject = 'VERIFICATION'
        const message = `
        <div style="font-family: Arial, sans-serif; background-color: #8BC34A; color: #FFFFFF; padding: 20px; text-align: center;">
            <h1 style="color: #FFFFFF; font-size: 28px;">Verification Email</h1>
            <h3 style="color: #FFFFFF; font-size: 20px;">Welcome</h3>
            <h4>Click on the button below and enjoy post your own advertisements feature</h4>
            <br>
            <a href="http://${IPs.serverIP}:3000/user/signup/active/${user.token}" style="text-decoration: none; background-color: #FFFFFF; color: #8BC34A; padding: 10px 20px; border-radius: 5px; display: inline-block; font-size: 20px; margin-top: 10px; transition: all 0.3s ease;">
            Active your account
            </a>
        </div>
        `
        sendMail(user.email, message, subject)
        return res.status(200).send(user)
    } catch (error) {
        return res.status(500).send('500 :: Server error')
    }
})

signin.post('/forgot_my_password', async (req, res) => {
    try {
        const { email } = req.body

        const user = await User.findOne({ email: email })

        if (!user) 
            return res.status(401).send('Invalid Email')


        const resetToken = uuid()

        const message = `
        <div style="font-family: Arial, sans-serif; background-color: #8BC34A; color: #FFFFFF; padding: 20px; text-align: center;">
            <h1 style="color: #FFFFFF; font-size: 28px;">Copy this code and paste it in "Recover Password Code Field" to reset your password</h1>
            <br>
            <h3>${resetToken}</h3>
        </div>
        `

        const session = {
            email : user.email,
            userName : user.firstname + " " + user.lastname,
            resetToken: resetToken
        }

        req.session.resetPasswordSession = session

        sendMail(email, message, 'RECOVER YOUR ACCOUNT')

        return res.status(200).send(session)

    } catch (error) {
        console.log(error)
        return res.status(500).send('Server error, tyy again')
    }
})

signin.post('/isValidCode', (req, res) => {

    const {token} = req.body

    console.log(req.session.resetPasswordSession)

    if (!req.session.resetPasswordSession) 
        return res.status(401).send('Error : no session reset')

    if (token == req.session.resetPasswordSession.resetToken) 
        return res.status(200).send(req.session.resetPasswordSession)

    return res.status(409).send('Invalid code')

})

signin.post('/reset', async (req, res) => {
    try {
        if (!req.session.resetPasswordSession) 
            return res.status(401).send('Error : no session reset')

        const user = await User.findOne({email : req.session.resetPasswordSession.email})

        const { newPassword } = req.body

        user.password = await  cryptPassword(newPassword)
        await user.save()

        return res.status(200).send()

    } catch (error) {
        console.log(error)
        return res.status(500).send('Server Error')
    }
})

const cryptPassword = async (plainText) => {
    return await bcrypt.hash(plainText,12)
}


module.exports = signin

