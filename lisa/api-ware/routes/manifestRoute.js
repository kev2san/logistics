const express 	= require('express')
const manifest   = require('../controllers/manifestController')

const route 	= express.Router()
route.get('/getManifestPartner', manifest.getManifestPartner)
route.post('/uploadtManifestPartner', manifest.uploadtManifestPartner )


module.exports = route
