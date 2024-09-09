const express 	= require('express')
const management   = require('../controllers/managementController')

const route 	= express.Router()

route.post('/sendMail', management.sendMail) 
route.post('/sendFormTenant', management.sendFormTenant)
route.post('/sendFormLessor', management.sendFormLessor)
route.post('/createProperty', management.createProperty)
route.post('/editProperty', management.editProperty)

route.get('/getDataPropertys', management.getDataPropertys)
route.get('/getDataPropertyID/:id', management.getDataPropertyID)
route.get('/validate/:idproperty/:contactForm', management.validate)
route.get('/validateResponse/:idcontact_propertys/:contactForm', management.validateResponse)

route.get('/getRegions', management.getRegions)
route.get('/getDistricts/:idregion', management.getDistricts)

module.exports = route