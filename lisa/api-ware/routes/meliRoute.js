const express 	= require('express')
const meli   = require('../controllers/meliController')

const route 	= express.Router()

route.get('/getPartner', meli.getPartner)
route.get('/getPickupByPartner/:i_idpartner', meli.getPickupByPartner)
route.get('/getPickupByPartnerMeli', meli.getPickupByPartnerMeli)

route.post('/registerToken', meli.registerToken)
route.post('/getInformationMeli', meli.getInformationMeli)

module.exports = route
