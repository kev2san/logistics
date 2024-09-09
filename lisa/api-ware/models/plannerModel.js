const pool = require('./connectModel')
const error = require('../middlewares/errorManagement')

const getPendingItem = async (req, res) => {
	let query = {
        text: `
        SELECT v_zone, 
            SUM(CASE WHEN picked = 'true' THEN 1 ELSE 0  END) as total ,
			SUM(items_pickup) items_pickup
        FROM 
        (
            SELECT 
               a.v_zone, 
               a.i_iddispatch,
               SUM(CASE WHEN b.d_date_pickup IS NOT NULL THEN 1 ELSE 0 END ) as items_pickup,
               SUM(CASE WHEN b.d_date_pickup IS NOT NULL THEN 1 ELSE 0 END ) = COUNT(DISTINCT b.i_iditem) as picked
            
           FROM dispatches a 
           INNER JOIN items b
               ON a.i_iddispatch=b.i_iddispatch
           WHERE v_zone NOT IN ('0','NE')
                AND a.d_date_delivered IS NULL
                AND a.v_ppu_assigned IS NULL
                AND a.b_active = true
           GROUP BY a.v_zone, a.i_iddispatch
       ) as t_result 
       GROUP BY v_zone
       HAVING SUM(CASE WHEN picked = 'true' THEN 1 ELSE 0  END) > 0;
        `,

        values: [],
        }

        return pool()
        .query(query)
        .then(response => response)
        .catch(err => {throw err})
}

const pxZone = async (req, res) => {
    inQuery = req.zones.join()
    
	let query = {
        text: `
            SELECT 
                a.v_zone, 
                a.i_iddispatch,
                a.c_delivery_latitude,
                a.c_delivery_longitude,
                a.v_guide_partner,
                a.i_order_default,
                a.i_order_pick,
                a.v_order_default,
                a.v_ppu_assigned
            FROM dispatches a 
            INNER JOIN items b
                ON a.i_iddispatch=b.i_iddispatch
            WHERE v_zone IN (${inQuery}) 
                AND a.d_date_delivered IS NULL
                AND a.v_ppu_assigned IS NULL
            GROUP BY a.v_zone, a.i_iddispatch, a.i_order_default, a.i_order_pick, a.v_order_default, a.v_ppu_assigned
            HAVING (SUM(CASE WHEN b.d_date_pickup IS NOT NULL THEN 1 ELSE 0 END ) = COUNT(DISTINCT b.i_iditem)) = true
            ORDER BY v_zone
        `,

        values: [],
        }
        console.log(req.zones.join())
        return pool()
        .query(query)
        .then(response => response)
        .catch(err => {throw err})
}

const pxZonePpu = async (req, res) => {
    values = req.zones.split(',',2)
    console.log(values)
    
	let query = {
        text: `
            SELECT 
                a.v_zone, 
                a.i_iddispatch,
                a.c_delivery_latitude,
                a.c_delivery_longitude,
                a.v_guide_partner,
                a.i_order_default,
                a.i_order_pick,
                a.v_order_default,
                a.v_ppu_assigned
            FROM dispatches a 
            INNER JOIN items b
                ON a.i_iddispatch=b.i_iddispatch
            WHERE a.v_ppu_assigned = $1 
                AND a.i_idplanner = $2 
                AND a.d_date_delivered IS NULL
            GROUP BY a.v_zone, a.i_iddispatch, a.i_order_default, a.i_order_pick, a.v_order_default, a.v_ppu_assigned
            --HAVING (SUM(CASE WHEN b.d_date_pickup IS NOT NULL THEN 1 ELSE 0 END ) = COUNT(DISTINCT b.i_iditem)) = true
            ORDER BY v_zone
        `,

        values: [values[0],values[1]],
        }
        
        return pool()
        .query(query)
        .then(response => response)
        .catch(err => {throw err})
}

const pxZoneAssigned = async (req, res) => {
    inQuery = req.zones.join()
    console.log(inQuery)
	let query = {
        text: `
            SELECT 
                a.v_zone, 
                a.i_iddispatch,
                a.c_delivery_latitude,
                a.c_delivery_longitude,
                a.v_guide_partner,
                a.i_order_default,
                a.i_order_pick,
                a.v_order_default,
                a.v_ppu_assigned
            FROM dispatches a 
            INNER JOIN items b
                ON a.i_iddispatch=b.i_iddispatch
            WHERE v_zone IN (${inQuery}) 
                AND a.d_date_delivered IS NULL
            GROUP BY a.v_zone, a.i_iddispatch, a.i_order_default, a.i_order_pick, a.v_order_default, a.v_ppu_assigned
            HAVING (SUM(CASE WHEN b.d_date_pickup IS NOT NULL THEN 1 ELSE 0 END ) = COUNT(DISTINCT b.i_iditem)) = true
        `,

        values: [],
        }
        console.log(req.zones.join())
        return pool()
        .query(query)
        .then(response => response)
        .catch(err => {throw err})
}

const getVehicleActive = (req,res) =>{
    let query = {
        text : `SELECT 
                    a.i_idvehicle,
                    a.v_ppu,
                    b.v_names,
                    b.v_surnames
                FROM vehicles a
                INNER JOIN users b
                    ON a.i_iduser_driver=b.i_iduser
                WHERE a.b_active IS TRUE`,
        values : []
    }
    return pool()
    .query(query)
    .then(response => response)
    .catch(err => {throw err})
} 

const assign = (req,res,v_ppu,pxs) =>{
    inQuery = req.zones.join()
    
    let query = {
        text : `UPDATE dispatches
                SET
                    v_ppu_assigned = $1
                WHERE i_iddispatch in (
                SELECT a.i_iddispatch
                FROM dispatches a
                INNER JOIN items b
                    on a.i_iddispatch=b.i_iddispatch
                WHERE v_zone in (${inQuery})
                    AND a.v_ppu_assigned IS NULL
                    AND b.d_date_pickup IS NOT NULL
                ORDER BY NULLIF(regexp_replace(v_zone, '\D', '', 'g'), '')::int ASC
                LIMIT $2);`,
        values : [v_ppu,pxs]
    }

    return pool()
    .query(query)
    .then(response => response)
    .catch(err => {throw err})
} 

const getAssinedDispatch = (req,res) =>{
    let query = {
        text : `SELECT v_ppu_assigned,
                    i_idplanner,
                    COUNT(DISTINCT v_zone) as q_zone, 
                    COUNT(DISTINCT i_iddispatch) as total_dispatch,
                    SUM(q_items) as q_items
                FROM (
                    SELECT 
                        DISTINCT a.v_zone,
                        a.i_iddispatch,	
                        a.v_ppu_assigned,
                        a.i_idplanner,
                        SUM(CASE WHEN b.d_date_pickup IS NOT NULL THEN 1 ELSE 0 END ) as items_pickup,
                        COUNT(DISTINCT b.i_iditem) AS q_items,
                        SUM(CASE WHEN b.d_date_pickup IS NOT NULL THEN 1 ELSE 0 END ) = COUNT(DISTINCT b.i_iditem) as picked
                    FROM dispatches a 
                    INNER JOIN items b
                        ON a.i_iddispatch=b.i_iddispatch
                    WHERE v_zone != '0'
                        AND a.d_date_delivered IS NULL
                        AND a.v_ppu_assigned IS NOT NULL
                        AND a.b_active = true
                        GROUP BY a.v_zone, a.i_iddispatch, a.v_ppu_assigned
                    ) as t_result 
                GROUP BY v_ppu_assigned,i_idplanner
                HAVING SUM(CASE WHEN picked = 'true' THEN 1 ELSE 0  END) > 0;`,
        values : []
    }

    return pool()
    .query(query)
    .then(response => response)
    .catch(err => {throw err})
} 

const viewZone = async(req, res) => {
	const pool = require('./connectCoorModel')

	let query = {
		text : `SELECT * 
				FROM grid_coordinates a
				WHERE country = $1`,
		// values : [req.country]
        values : ['1']
	}

	return pool()
	.query(query)
	.then(response => response.rows)
	.catch(err => {throw err})
}

const unassign = async(req, res) => {
    // Esta separado porque se envia la ppu y el planner juntos
    values = req.v_ppu_planner.split(',',2)
    
	let query = {
		text : `UPDATE dispatches
                SET
                    v_ppu_assigned = null,
                    i_idplanner = null,
                    taken = false
                WHERE v_ppu_assigned = $1
                    AND i_idplanner = $2`,
		// values : [req.country]
        
        values : [values[0],values[1]]
	}

	return pool()
	.query(query)
	.then(response => response.rows)
	.catch(err => {throw err})
}

const getPartner = async (req, res) => {
    let query = {
        text: `
        SELECT 
            i_idpartner,
            v_name
        FROM partners a
        WHERE b_active IS TRUE;
        `,

        values: [],
        }

        return pool()
        .query(query)
        .then(response => response)
        .catch(err => {throw err})
}

const getPickup = async (req, res) => {
    let query = {
        text: `
            SELECT 
                a.i_idpartner,
                a.v_name,
                b.i_idpartner_pickup,
                b.v_partner_pickup
            FROM partners a
            INNER JOIN partner_pickup b
                ON a.i_idpartner=b.i_idpartner
            WHERE 
                a.b_active IS TRUE 
                AND b.b_active IS TRUE;
        `,

        values: [],
    }

    return pool()
    .query(query)
    .then(response => response)
    .catch(err => {throw err})
}

const getPendingItemFilter = async (pickup, date, res) => {
    let query = {
        text: `
        SELECT v_zone, 
            SUM(1) as total, --borrar
            --SUM(CASE WHEN picked = 'false' THEN 1 ELSE 0  END) as total ,
            SUM(items_pickup) items_pickup
        FROM 
        (
            SELECT 
               a.v_zone, 
               a.i_iddispatch,
               SUM(CASE WHEN b.d_date_pickup IS NOT NULL THEN 1 ELSE 0 END ) as items_pickup,
               SUM(CASE WHEN b.d_date_pickup IS NOT NULL THEN 1 ELSE 0 END ) = COUNT(DISTINCT b.i_iditem) as picked
            
           FROM dispatches a 
           INNER JOIN items b
               ON a.i_iddispatch=b.i_iddispatch
           WHERE v_zone NOT IN ('0','NE')
                AND a.d_date_delivered IS NULL
                AND a.v_ppu_assigned IS NULL
                ${pickup}
                ${date}
           GROUP BY a.v_zone, a.i_iddispatch
       ) as t_result 
       GROUP BY v_zone
       --HAVING SUM(CASE WHEN picked = 'false' THEN 1 ELSE 0  END) > 0;
        `,

        values: [],
        }

        return pool()
        .query(query)
        .then(response => response)
        .catch(err => {throw err})
}

const getClusters = async (req, res) => {
    let query = {
        text: `
            SELECT 
                a.v_zone, 
                a.i_iddispatch,
                a.c_delivery_latitude,
                a.c_delivery_longitude,
                a.v_guide_partner,
                a.i_order_default,
                a.i_order_pick,
                a.v_order_default,
                a.v_ppu_assigned,
                v_transport_temp
            FROM dispatches a
            WHERE i_idcluster = $1
        `,

        values: [req.idcluster],
        }

        return pool()
        .query(query)
        .then(response => response)
        .catch(err => {throw err})
}

const getClustersGroup = async (req, res) => {
    let query = {
        text: `
            SELECT 
                v_transport_temp,
                i_idcluster,
                count(*) as total
            FROM dispatches a
            WHERE i_idcluster = $1
            GROUP BY i_idcluster,v_transport_temp
        `,

        values: [req.idcluster],
        }

        return pool()
        .query(query)
        .then(response => response)
        .catch(err => {throw err})
}


const assignTransport = async (idcluster, transport, ppu, res) => {
    let query = {
        text: `
            UPDATE dispatches SET
                v_ppu_assigned = $1
            WHERE v_transport_temp = $2
                AND i_idcluster = $3
        `,

        values: [ppu, transport, idcluster],
        }

        return pool()
        .query(query)
        .then(response => response)
        .catch(err => {throw err})
} 


module.exports = { 
    getPendingItem,
    pxZone,
    getVehicleActive,
    assign,
    unassign,
    getAssinedDispatch,
    viewZone,
    pxZoneAssigned,
    pxZonePpu,
    getPartner,
    getPickup,
    getPendingItemFilter,
    getClusters,
    getClustersGroup,
    assignTransport
}