const pool = require('./connectModel')

const getBillingPeriod = async (req, res) => {
        let query = {
                text: `
                SELECT DISTINCT period FROM vw_billing_period ORDER BY period
                `,
                values: [],
        }

        return pool()
        .query(query)
        .then(response => response)
        .catch(err => {throw err})
}


const getBillingByPeriod = async (req, res) => {
    let query = {
            text: `
            SELECT
                n_cost, 
                n_price,
                i_items, 
                i_items_delivered, 
                i_items_notdelivered, 
                i_dispatches, 
                i_dispatches_delivered, 
                i_dispatches_notdelivered, 
                v_userppu_delivered, 
                v_ppu_delivered, 
                period 
            FROM vw_billing_period
            WHERE period = $1 ;
            `,
            values: [req.period],
    }
    return pool()
    .query(query)
    .then(response => response)
    .catch(err => {throw err})
}

const getUserPPUData = async (req, res, jwt) => {
        let query = {
                text: `
                SELECT * FROM fn_create_pre_invoice($1,$2,$3,$4);;
                `,
                values: [req.userppu,req.period,jwt.username,req.preinvoice_type],
        }
        return pool()
        .query(query)
        .then(response => response)
        .catch(err => {throw err})
    }

module.exports = {
        getBillingPeriod,
        getBillingByPeriod,
        getUserPPUData
}