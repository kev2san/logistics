const express 	= require('express')
const dashboard   = require('../controllers/dashboardController')

const route 	= express.Router()

route.post('/getDashOne', dashboard.getDashOne)

module.exports = route