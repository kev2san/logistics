const express 	= require('express')
const planner    	= require('../controllers/plannerController')

const route 	= express.Router()

route.get('/getPendingItem', planner.getPendingItem)
route.get('/getVehicleActive', planner.getVehicleActive)
route.post('/getClusters', planner.getClusters)

route.post('/getPickup', planner.getPickup)
route.post('/pxZone', planner.pxZone)
route.post('/pxZoneAssigned', planner.pxZoneAssigned)
route.post('/assign', planner.assign)
route.post('/unassign', planner.unassign)
route.post('/filterZones', planner.filterZones)
route.post('/assignClusterToTransport', planner.assignClusterToTransport)


module.exports = route