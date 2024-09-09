const express 	= require('express')
const transport   = require('../controllers/transportController')

const route 	= express.Router()
route.post('/checkDisponibility', transport.checkDisponibility)
route.post('/addDisponibility', transport.addDisponibility)
route.post('/getDisponibility', transport.getDisponibility)
route.post('/inactiveDisponibility',transport.inactiveDisponibility)
route.post('/getIncomeData',transport.getIncomeData)
route.post('/getIncomePeriod',transport.getIncomePeriod)


module.exports = route
