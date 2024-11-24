const { Advertisement } = require('../../Models/advert')
const { User } = require('../../Models/user')
const fs = require('fs')
const path = require('path')

const save = (userId, addId, Images) => {
    try {
        const userFolderPath = 'user/' + userId + '/adverts/' + addId;

        fs.mkdirSync(userFolderPath, { recursive: true })

        const uploadedImages = []

        Images.forEach((img, index) => {
            const filePath = userFolderPath + '/' + addId+ index + '.jpg'
            img = img.replace(/^data:image\/jpeg;base64,/, '')
            fs.writeFile(filePath, img, 'base64', (err) => {
                if (err) {
                  uploadedImages.push(false)
                }
                uploadedImages.push(true)
              });
        })
        console.log(uploadedImages)
        return [true, uploadedImages]

    } catch (error) {
        console.log(error)
        return false
    }
}

module.exports = save