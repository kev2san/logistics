const express 	= require('express')
const dashboard   = require('../controllers/dashboardController')

const route 	= express.Router()

route.post('/getDashboardPartner', dashboard.getDashboardPartner)
route.post('/periodPartner', dashboard.periodPartner)
route.post('/reportPartner', dashboard.reportPartner)

route.get('/getPartner', dashboard.getPartner)
route.get('/getPickupByPartner/:i_idpartner', dashboard.getPickupByPartner)
route.get('/viewPhotosItem/:iditem', dashboard.viewPhotosItem)


module.exports = route