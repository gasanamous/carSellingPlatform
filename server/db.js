const mongoose = require("mongoose")
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/CarSellAndRental')
}
main().then(() => {
    console.log('CONNECTED TO MONGO-DB SUCCCESSFULY')
})
.catch((e) => {
      console.log('ERROR WITH CONNECTION TO DATABASE', e.message)
})
module.exports = mongoose