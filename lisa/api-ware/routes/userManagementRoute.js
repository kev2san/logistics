const express 	= require('express')
const user    	= require('../controllers/userManagementController')

const route 	= express.Router()


route.get('/getRegion', user.getRegion)
route.get('/getDistrict/:id', user.getDistrict)
route.post('/createUser', user.createUser)

module.exports = route
