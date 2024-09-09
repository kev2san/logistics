const express 	= require('express')
const accounting   = require('../controllers/accountingController')

const route 	= express.Router()

route.get('/getBillingPeriod', accounting.getBillingPeriod)

route.post('/getBillingByPeriod', accounting.getBillingByPeriod)
route.post('/getUserPPUData', accounting.getUserPPUData)


module.exports = route