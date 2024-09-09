const express 	= require('express')
const partner   = require('../controllers/partnerController')
const route 	= express.Router()

route.post('/createPartner', partner.createPartner)
route.post('/inactivePartner', partner.inactivePartner)
route.post('/createPartnerPickup', partner.createPartnerPickup)
route.post('/inactivePickup', partner.inactivePickup)
route.post('/editPartnerPickup', partner.editPartnerPickup)
route.post('/createPartnerPrice', partner.createPartnerPrice)
route.post('/inactivePartnerPrice', partner.inactivePartnerPrice)
route.post('/periodPartnerPay', partner.periodPartnerPay)
route.post('/reportPartnerPay', partner.reportPartnerPay)

route.get('/getPartners', partner.getPartners)
route.get('/getPartnersActive', partner.getPartnersActive)
route.get('/getPartnersPickup', partner.getPartnersPickup)
route.get('/getPickupDetail/:idpickup', partner.getPickupDetail)
route.get('/getSizesActive', partner.getSizesActive)
route.get('/getPartnersPrice', partner.getPartnersPrice)
route.get('/getPickupByPartner/:idpartner', partner.getPickupByPartner)


module.exports = route