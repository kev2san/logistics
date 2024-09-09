const express 	= require('express')
const dispatch   = require('../controllers/dispatchController')

const route 	= express.Router()
route.post('/getDispatchToDelivery', dispatch.getDispatchToDelivery)
route.post('/getDispatchItem', dispatch.getDispatchItem)
route.post('/updateDispatchItemsPhotos', dispatch.updateDispatchItemsPhotos)
route.post('/reportDispatch', dispatch.reportDispatch)
route.post('/reportPending', dispatch.reportPending)
route.post('/changeStatus', dispatch.changeStatus)

route.get('/viewPhotos/:iddispatch', dispatch.viewPhotos)
route.get('/viewItems/:iddispatch', dispatch.viewItems)

module.exports = route