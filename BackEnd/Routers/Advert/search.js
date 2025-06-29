const  {Advertisement} = require('../../Models/advert')
const { User } = require('../../Models/user')

const search = async(requestQuery) => {
    const {       
        carManufacturer: companyRequested = '',
        productionYear: yearRequested = '',
        transmission: transmissionRequested = '',
        fuelType: fuelTypeRequested = '',
        minPrice : minPriceRequested = '',
        maxPrice : maxPriceRequested = ''
    } = requestQuery
    let query = {}

    if (companyRequested != '') {
        query['carManufacturer'] = companyRequested;
    }

    if (yearRequested != '') {
        query['productionYear'] = yearRequested;
    }

    if (transmissionRequested != '') {
        query['transmission'] = transmissionRequested;
    }

    if (fuelTypeRequested != '') {
        query['fuelType'] = fuelTypeRequested;
    }
    if (minPriceRequested != '' && minPriceRequested != null) {
        query['price'] = { $gte: minPriceRequested };
    }
    if (maxPriceRequested !== '' && maxPriceRequested != null) {
        query['price'] = {
            ...(query['price'] || {}),
            $lte: maxPriceRequested
        };
    }
    const result = await Advertisement.find(query).populate('user')
    return result
}
module.exports = search
