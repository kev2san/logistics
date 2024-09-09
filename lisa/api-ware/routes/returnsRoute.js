const express 	= require('express')
const returns    	= require('../controllers/returnsController')

const route 	= express.Router()

route.get('/getVehicleActive', returns.getVehicleActive)
route.post('/loadReturns', returns.loadReturns)

module.exports = route