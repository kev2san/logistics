const express 	= require('express')
const contract   = require('../controllers/contractController')


const route 	= express.Router()

route.get('/getInfoData/:id_property', contract.getInfoData)

route.post('/makehtml', contract.makehtml)
route.post('/saveInfo', contract.saveInfo)
route.get('/sendWhatsapp/:number', contract.sendWhatsapp)

module.exports = route