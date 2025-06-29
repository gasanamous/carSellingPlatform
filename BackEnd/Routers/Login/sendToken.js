const nodemailer = require('nodemailer')

const sendMail = (to, message, subject) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'gasanamous@gmail.com',
            pass: 'vili znvf zrof qbuy'
        }
    });
    const mailOptions = {
        from: 'gasanamous@gmail.com',
        to: to,
        subject:subject,
        html: message
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error)
        }
        else
            console.log(`EMAIL SENT TO ${to} successfully :::  ${info} `)
        console.log(info)
    })
}

module.exports = sendMail