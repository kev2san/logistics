const pool = require('./connectModel')
const error = require('../middlewares/errorManagement')

const searchStatusDispatch = (req,res) =>{
    let query = {
        text : `SELECT 
                    a.v_guide_lidia,
                    SUM(CASE WHEN a.d_created_at IS NOT NULL THEN 1 ELSE 0 END) = count(*) created_dispatch,
                    MIN(to_char(COALESCE(a.d_created_at::varchar,'2000-01-01 00:00:00')::timestamp(0), 'YYYY-MM-DD HH24:MI:SS')) d_created_dispatch,
                    SUM(CASE WHEN d_date_pickup IS NOT NULL THEN 1 ELSE 0 END) = count(*) recalled,
                    MIN(to_char(COALESCE(d_date_pickup::varchar,'2000-01-01 00:00:00')::timestamp(0), 'YYYY-MM-DD HH24:MI:SS')) d_recalled,
                    SUM(CASE WHEN d_date_pickup_received IS NOT NULL THEN 1 ELSE 0 END) = count(*) received,
                    MIN(to_char(COALESCE(d_date_pickup_received::varchar,'2000-01-01 00:00:00')::timestamp(0), 'YYYY-MM-DD HH24:MI:SS')) d_received,
                    SUM(CASE WHEN d_date_sorted IS NOT NULL THEN 1 ELSE 0 END) = count(*) sorted,
                    MIN(to_char(COALESCE(d_date_sorted::varchar,'2000-01-01 00:00:00')::timestamp(0), 'YYYY-MM-DD HH24:MI:SS')) d_sorted,
                    MIN(a.v_ppu_assigned) assigned,
                    SUM(CASE WHEN b.d_date_onroute IS NOT NULL THEN 1 ELSE 0 END) = count(*) on_route,
                    MIN(to_char(COALESCE(b.d_date_onroute::varchar,'2000-01-01 00:00:00')::timestamp(0), 'YYYY-MM-DD HH24:MI:SS')) d_date_onroute,
                    SUM(CASE WHEN a.d_date_delivered IS NOT NULL THEN 1 ELSE 0 END) = count(*) delivered,
                    MIN(to_char(COALESCE(a.d_date_delivered::varchar,'2000-01-01 00:00:00')::timestamp(0), 'YYYY-MM-DD HH24:MI:SS')) d_date_delivered,
                    count(*) total
                FROM dispatches a
                INNER JOIN items b
                    ON a.i_iddispatch=b.i_iddispatch
                WHERE v_guide_lidia = $1
                GROUP BY a.v_guide_lidia;
    `,
        values : [req.guide_lidia]
    }

    return pool()
    .query(query)
    .then(response => response)
    .catch(err => {throw err})
}

module.exports = {
    searchStatusDispatch
}