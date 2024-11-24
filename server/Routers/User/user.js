const express = require('express')
const userRouter = express.Router()
const checkExistence = require('../Register/userExistenceCheck')
const bcrypt = require('bcrypt')
const sendMail = require('../Login/sendToken')
const { v4: uuid } = require('uuid')
const { User } = require('../../Models/user')
const IPs = require('../../config')
const Report = require('../../Models/reports')
const { Advertisement } = require('../../Models/advert')

const isLoggedIn = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).send()
  }
  return next()
}
userRouter.get('/logout', async (req, res) => {
  if (req.session.user) {
    const user = await User.findById(req.session.user.id)
    user.isLoggedIn = false
    await user.save()
    req.session.user = null
  }
  res.redirect(`${IPs.clientIP}/user/signin`)
})

userRouter.post('/userData', (req, res) => {

  if (req.session.user) {
    return res.status(200).send({ user: req.session.user })
  }

  return res.status(401).send()
})

userRouter.post('/allUserData', isLoggedIn, async (req, res) => {
  const user = await User.findById(req.session.user.id)
  return res.status(200).send(user)
})

userRouter.post('/edit', isLoggedIn, async (req, res) => {

  try {
    const { formData } = req.body

    const user = await User.findById(req.session.user.id)

    if (user.phoneNumber != formData.phoneNumber) {
      const isExistUser = await checkExistence(formData.phoneNumber)
      console.log(user.phoneNumber, formData.phoneNumber, 'is exist ', isExistUser)
      if (Object.entries(isExistUser).length != 0)
        return res.status(422).send({ errors: isExistUser })
    }

    user.firstname = firstCharacterUpperCase(formData.firstname)
    user.lastname = firstCharacterUpperCase(formData.lastname)
    user.phoneNumber = formData.phoneNumber
    user.city = firstCharacterUpperCase(formData.city)

    await user.save()
    return res.status(200).send({ successMessage: 'Your profile has been updated successfully' })

  } catch (error) {
    if (error.errors) {
      const errorsMessages = {}
      Object.entries(error.errors).forEach(([key, value]) => {
        errorsMessages[capitalizeFirstLetter(key)] = value.properties.message
      })
      return res.status(422).send({ errors: errorsMessages })
    }

    return res.status(500).send({ errors: 'Sorry, an error occured while updating your profile, try again later' })
  }

})

userRouter.post('/editProfileImage', isLoggedIn, async (req, res) => {

  try {
    const { profile_img } = req.body
    const user = await User.findById(req.session.user.id)
    user.profile_img = profile_img
    const saveResult = await user.save()

    return res.status(200).send({ successMessage: 'Your profile image updated successfully' })


  } catch (error) {

    return res.status(500).send({ errors: 'Sorry, an error occured while changing your profile image, try again later' })
  }

})

userRouter.post('/editPassword', isLoggedIn, async (req, res) => {

  try {
    let { currentPassword, newPassword } = req.body

    const user = await User.findById(req.session.user.id)
    if (!await bcrypt.compare(currentPassword, user.password))
      return res.status(412).send({ errors: { 'Current password': 'Incorrect current password' } })

    newPassword = await cryptPassword(newPassword)
    user.password = newPassword

    await user.save()
    return res.status(200).send({ successMessage: 'Password changed successfully' })

  } catch (error) {
    console.log(error)
    return res.status(500).send()
  }
})

userRouter.post('/changeEmail', isLoggedIn, async (req, res) => {

  try {
    const { newEmail } = req.body
    const user = await User.findById(req.session.user.id)

    const isExistUser = await checkExistence(newEmail, '')
    if (Object.entries(isExistUser).length != 0)
      return res.status(422).send(isExistUser)

    const sToken = uuid()
    req.session.changeEmailSession = {
      id: user._id,
      newEmail: newEmail,
      token: sToken
    }

    const message = `
      <div style="font-family: Arial, sans-serif; background-color: #8BC34A; color: #FFFFFF; padding: 20px; text-align: center;">
          <h1 style="color: #FFFFFF; font-size: 28px;">Change your email address</h1>
          <p>You recently requested to change your email address to ${newEmail}</p>
          <h4>Click on the button below to complete changing your email address</h4>
          <br>
          <a href="http://localhost:3000/user/changeEmail/${sToken}" target="_parent" style="text-decoration: none; background-color: #FFFFFF; color: #8BC34A; padding: 10px 20px; border-radius: 5px; display: inline-block; font-size: 20px; margin-top: 10px; transition: all 0.3s ease;">
          Change my email
          </a>
      </div>
      `
    sendMail(newEmail, message, 'Change your Email Address')
    return res.status(200).send()

  } catch (error) {
    return res.status(500).send(error.message)
  }
})

userRouter.get('/ChangeEmail/:token', isLoggedIn, async (req, res) => {
  if (!req.session.changeEmailSession || req.params.token != req.session.changeEmailSession.token) 
      return res.status(401).send()

  const user = await User.findById(req.session.changeEmailSession.id)

  user.email = req.session.changeEmailSession.newEmail

  await user.save()

  req.session.user = null

  return res.redirect('http://localhost:5173/user/signin?emailChanged=true')

})

userRouter.post('/submitReport', async (req, res) => {
  try {
    const { formData } = req.body

    const report = new Report({
      firstname: capitalizeFirstLetter(formData.firstname),
      lastname: capitalizeFirstLetter(formData.lastname),
      email: formData.email.toLowerCase(),
      problemSubject: formData.problemSubject,
      additionalDetails: formData.additionalDetails,
      submissionDate: getCurrentDateTime()
    })

    let x = 0

    const result = await report.save()

    console.log(result)

    const message = 
    `
    The problem report has been received successfully. A feedback will be sent to your email ${report.email} within a short period
    `
    return res.status(200).send({ successMessage: message })


  } catch (error) {
    if (error.errors) {
      const errorsMessages = {}
      Object.entries(error.errors).forEach(([key, value]) => {
        errorsMessages[capitalizeFirstLetter(key)] = value.properties.message
      })
      console.log('ERRS:', errorsMessages)
      return res.status(422).send({ errors: errorsMessages })
    }
    return res.status(500).send({ errors: 'Sorry, an error occured while submitting the report, try again' })

  }
})

userRouter.post('/deleteMyAccount', isLoggedIn, async(req,res) => {
  try {
    const userId = req.session.user.id
    const deletedAccount = await User.findByIdAndDelete(userId)
    const deletedAdds = await Advertisement.findByIdAndDelete({user : userId})
    req.session.user = null
    return res.status(200).send({successMessage : 'Your account has been deleted successfully, also your advertisements has been deleted'})
  } catch(error){
    console.log(error.message)
    return res.status(500).send({errors : 'Sorry, an error occured while deleting your account, Please try again'})
  }
})

const cryptPassword = async (plainText) => {
  return await bcrypt.hash(plainText, 12)
}

const firstCharacterUpperCase = (str) => {
  if (str.length === 0)
    return str;
  str = str.toLowerCase()
  return str.charAt(0).toUpperCase() + str.slice(1);
}

module.exports = userRouter


function splitByCapitalLetter(attributeName) {
  let words = attributeName.replace(/([a-z])([A-Z])/g, '$1 $2').split(' ');
  words = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
  if (words == 'Price') return words.join(' ') + ' ($)';
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
