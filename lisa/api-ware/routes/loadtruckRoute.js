const express 	= require('express')
const loadtruck    	= require('../controllers/loadtruckController')

const route 	= express.Router()

route.post('/load', loadtruck.load)
route.post('/closeLoad', loadtruck.closeLoad)
route.post('/pendingLoad', loadtruck.pendingload)
route.post('/updateReceive', loadtruck.updateReceive)
route.post('/closeReceive', loadtruck.closeReceive)
route.post('/getDataAssignPickup', loadtruck.getDataAssignPickup)
route.post('/createAssignPickup', loadtruck.createAssignPickup)
route.post('/assigned', loadtruck.assigned)
route.post('/chargeInLoad', loadtruck.chargeInLoad)
route.post('/closeLoadForce', loadtruck.closeLoadForce)
route.post('/assignQr', loadtruck.assignQr)
route.post('/generateLabel', loadtruck.generateLabel)

route.get('/getVehicleActive', loadtruck.getVehicleActive)
route.get('/getPickupByPartner/:i_idpartner', loadtruck.getPickupByPartner)
route.get('/getPickupByVehicle/:i_idvehicle', loadtruck.getPickupByVehicle)
route.get('/getOpenPickup', loadtruck.getOpenPickup)
route.get('/viewZone/:country', loadtruck.viewZone)
route.get('/viewNearbyDrivers/:idpartner_pickup', loadtruck.viewNearbyDrivers)
route.get('/getListPickup', loadtruck.getListPickup)
route.get('/viewPickup/:country', loadtruck.viewPickup)

module.exports = route