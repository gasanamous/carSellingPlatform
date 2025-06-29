const express = require('express')
const adminRouter = express.Router()
const Report = require('../../Models/reports')
const { Advertisement } = require('../../Models/advert')
const { User } = require('../../Models/user')
const sendMail = require('../../Routers/Login/sendToken')

const isLoggedInMiddleware = (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).send()
    }
    return next()
}

const isAdmin = (req, res, next) => {
    if (req.session.user.role != 'admin')
        return res.status(404).send()
    return next()

}


adminRouter.post('/getInfo', isLoggedInMiddleware, isAdmin, async (req, res) => {

    try {
        const allUsers = await User.find({role : 'customer'})
        const allAdds = await Advertisement.find({}).populate('user')
        const allReports = await Report.find({})

        return res.status(200).send({
            users : allUsers,
            adds : allAdds,
            reports : allReports
        })

    } catch (error) {
        console.log(error.message)
        return res.status(500).send()
    }
})

adminRouter.post('/delete_users',isLoggedInMiddleware, isAdmin, async(req,res) => {
    try {
        const {users} = req.body

        const userIDs = users.map(user => user._id)
        const deletedUsers = await User.deleteMany({ _id: { $in: userIDs } })
        const deletedAdds = await Advertisement.deleteMany({user : {$in : userIDs}})
        res.status(200).send({ deletedCount: {users : deletedUsers.deletedCount, adds : deletedAdds.deletedCount } })

    } catch (error) {
        console.log(error.message)
        return res.status(500).send()
    }
})

adminRouter.post('/sendFeedback',isLoggedInMiddleware, isAdmin, async(req,res) => {
    try {
        const {feedbackMessage, to,selectedReport} = req.body
        console.log(selectedReport)
        sendMail(to, feedbackMessage, 'Report Feedback')

        const thisReport = await Report.findById(selectedReport.repId)
        thisReport.status = 'handled'
        thisReport.feedback = feedbackMessage
        await thisReport.save()
        return res.status(201).send()
    } catch (error) {
        console.log(error.message)
        return res.status(500).send()
    }
})

module.exports = adminRouter