const express 		= require('express')
const integrations  = require('../controllers/integrationsController')

const route 	= express.Router()

route.post('/send', integrations.weebhook_kleemarket)

module.exports = route
