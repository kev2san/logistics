const express 	= require('express')
const search    = require('../controllers/searchController')

const route 	= express.Router()

route.get('/searchStatusDispatch/:guide_lidia', search.searchStatusDispatch)

module.exports = route