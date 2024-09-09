const pool = require('./connectModel')
const error = require('../middlewares/errorManagement')

const getVehicleActive = (req,res) =>{
    let query = {
        text : `SELECT 
                    i_idvehicle,
                    v_ppu
                FROM vehicles
                WHERE b_active IS TRUE`,
        values : []
    }

    return pool()
    .query(query)
    .then(response => response)
    .catch(err => {throw err})
}

const loadReturns = (req,res) =>{
    let query = {
        text : `UPDATE items
                SET
                    d_date_onroute = null,
                    d_date_returned = now(),
                    v_user_returned = $1
                WHERE 
                    v_lidia_sku = $2`,
        values : [req.v_ppu,req.item]
    }

    return pool()
    .query(query)
    .then(response => response)
    .catch(err => {throw err})
}

module.exports = {
    getVehicleActive,
    loadReturns
}