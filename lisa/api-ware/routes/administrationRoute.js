const express 	= require('express')
const administration    	= require('../controllers/administrationController')

const route 	= express.Router()


route.post('/createVehicle', administration.createVehicle)
route.post('/createUserCrews', administration.createUserCrews)
route.post('/editUserCrews', administration.editUserCrews)
route.post('/assignDriver', administration.assignDriver)
route.post('/editVehicle', administration.editVehicle)

route.get('/getRegion', administration.getRegion)
route.get('/getDistrict/:idregion', administration.getDistrict)
route.get('/showUsersCrews', administration.showUsersCrews)
route.get('/changeStatusUser/:iduser/:active', administration.changeStatusUser)
route.get('/changeStatusVehicle/:idvehicle/:active', administration.changeStatusVehicle)
route.get('/getUserDetail/:iduser', administration.getUserDetail)
route.get('/getVehiclesWithCrew/', administration.getVehiclesWithCrew)
route.get('/getVehicleType/', administration.getVehicleType)
route.get('/getDrivers/:iduser_level', administration.getDrivers)
route.get('/getVehicleDetail/:idvehicle', administration.getVehicleDetail)


module.exports = route