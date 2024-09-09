const pool = require('./connectModel')


const findLoad = async(req,res,jwt) => {
	
	let query = {
        text: `
        	SELECT i_iditem
        	FROM items
        	WHERE v_partner_code=$1 AND
        		i_idpartner_pickup = $2;
        `,

        values: [req.v_partner_code, req.i_idpartner_pickup],
    }

    return pool()
    .query(query)
    .then(response => response)
    .catch(err => {throw err})
}

const updateLoad = async(req,res,jwt) => {
    
    let query = {
        text: `
            UPDATE items
            SET
                d_date_pickup = now(),
                v_user_pickup = $1,
                v_ppu_pickup = $2
            WHERE v_partner_code = $3;
        `,

        values: [jwt.username, req.v_ppu_pickup, req.v_partner_code],
    }

    return pool()
    .query(query)
    .then(response => response)
    .catch(err => {throw err})
}

const load = async(req,res,jwt) => {
	
	let query = {
        text: `
        	INSERT INTO items(
        		v_partner_code,
        		d_date_pickup,
        		v_user_pickup,
        		v_ppu_pickup,
                i_idpartner,
        		i_idpartner_pickup) 
        	VALUES (
        		$1,now(),$2,$3,$4,$5
        	) RETURNING i_iditem
        `,

        values: [req.v_partner_code, jwt.username, req.v_ppu_pickup, req.i_idpartner, req.i_idpartner_pickup],
    }
    
    return pool()
    .query(query)
    .then(response => response)
    .catch(err => {

    	if (err.code == '23505'){
    		return true
    	}else{
			throw err
    	}

	})
}

const getPendingLoad = async(req,res) => {
	
	let query = {
        text: `
        	SELECT 
        		i_iditem,
        		v_partner_code,
                v_lidia_sku,
        		d_date_pickup,
        		v_user_pickup,
        		v_ppu_pickup,
        		i_idpartner_pickup,
				d_date_pickup_received,
				case when d_date_pickup_received is null then 0 else 1 end mark
        	FROM items
        	WHERE i_idpartner = $1 AND d_date_pickup_received IS NULL
            AND b_active = 'true'
            ORDER BY v_partner_code
        `,

        values: [req.i_idpartner],
    }

    return pool()
    .query(query)
    .then(response => response)
    .catch(err => {throw err})
}

const updateReceive = async(req,res, jwt) => {
	let query = {
        text: `
        	UPDATE items
        	SET
        		d_date_pickup_received = now(),
        		v_user_pickup_received = $1
        	WHERE v_partner_code = $2 AND i_idpartner = $3
        `,

        values: [jwt.username, req.v_partner_code, req.i_idpartner],
    }
    
    return pool()
    .query(query)
    .then(response => response)
    .catch(err => {throw err})
}

const updateReceiveOffline = async(req,res, jwt) => {
	
	let query = {
        text: `
        	UPDATE items
        	SET
        		d_date_pickup_received = CASE WHEN d_date_pickup_received IS NULL THEN now() ELSE d_date_pickup_received END,
        		v_user_pickup_received = CASE WHEN d_date_pickup_received IS NULL THEN $1 ELSE v_user_pickup_received END
        	WHERE v_partner_code = $2 AND i_idpartner = $3
        `,

        values: [jwt.username, req.v_partner_code, req.i_idpartner],
    }

    return pool()
    .query(query)
    .then(response => response)
    .catch(err => {throw err})
}

const getVehicleActive = (req,res) =>{
	let query = {
        text: `
        	SELECT 
        		i_idvehicle, 
        		v_ppu
        	FROM vehicles
        	WHERE b_active IS true
        `,

        values: [],
    }

    return pool()
    .query(query)
    .then(response => response)
    .catch(err => {throw err})
}

const getPartnerActive = (req,res) =>{
	let query = {
        text: `
        	SELECT 
        		i_idpartner, 
        		v_name
        	FROM partners
        	WHERE b_active IS true
        `,

        values: [],
    }

    return pool()
    .query(query)
    .then(response => response)
    .catch(err => {throw err})
}

const getPartnerPickupActive = (req,res) =>{
	let query = {
        text: `
        	SELECT 
        		i_idpartner_pickup,
        		v_address
        	FROM partner_pickup
        	WHERE b_active IS true AND i_idpartner = $1
        `,

        values: [req.i_idpartner],
    }

    return pool()
    .query(query)
    .then(response => response)
    .catch(err => {throw err})
}

const getPartnerPickup = (req,res) =>{
	let query = {
        text: `
            SELECT 
                a.i_idpartner_pickup,
                a.v_address,
                b.v_name,
                a.v_contact_name,
                a.v_contact_phone,
                a.c_longitude,
                a.c_latitude
            FROM partner_pickup a 
            INNER JOIN partners b
                ON a.i_idpartner=b.i_idpartner
            WHERE a.b_active IS true
        `,

        values: [],
    }

    return pool()
    .query(query)
    .then(response => response.rows)
    .catch(err => {throw err})
}

const getPartnerPickupById = (req,res) =>{
	let query = {
        text: `
            SELECT 
                c.v_name,
                b.v_pickup_code,
                b.v_contact_name,
                b.v_contact_phone,
                b.v_address,
                b.i_idpartner,
                b.i_idpartner_pickup,
                b.c_latitude,
                b.c_longitude,
                count(*) total,
                0 assign_total,
                0 pending_total
            FROM partner_pickup b
                        INNER JOIN partners c
                ON b.i_idpartner=c.i_idpartner
            WHERE b.i_idpartner_pickup = $1
            GROUP BY c.v_name,
                b.v_pickup_code,
                b.v_contact_name,
                b.v_contact_phone,
                b.v_address,
                b.i_idpartner,
                b.i_idpartner_pickup,
                b.c_latitude,
                b.c_longitude
        `,

        values: [req.idpartner_pickup],
    }

    return pool()
    .query(query)
    .then(response => response.rows)
    .catch(err => {throw err})
}

const getPickupByVehicle = (req,res) =>{
	let query = {
        text: `
        	SELECT 
        		a.i_idvehicle_pickup,
				b.i_idpartner_pickup,
                b.i_idpartner,
        		b.v_address,
        		a.d_created_at
        	FROM vehicle_pickup a
            INNER JOIN partner_pickup b
			    ON a.i_idpartner_pickup = b.i_idpartner_pickup
        	WHERE a.b_active IS true AND i_idvehicle = $1
        	ORDER BY a.i_idvehicle_pickup DESC
        `,

        values: [req.i_idvehicle],
    }

    return pool()
    .query(query)
    .then(response => response)
    .catch(err => {throw err})
}

const createAssignPickup = (req,res,jwt) =>{
	let query = {
        text: `
        	INSERT INTO vehicle_pickup(i_idvehicle,i_idpartner,i_idpartner_pickup,v_user_created,i_cost_pickup)
        	VALUES ($1,$2,$3,$4,$5)
        	RETURNING i_idvehicle_pickup
        `,

        values: [req.i_idvehicle,req.i_idpartner,req.i_idpartner_pickup,jwt.username,req.i_cost_pickup],
    }

    return pool()
    .query(query)
    .then(response => response)
    .catch(err => {throw err})
}

const validateVehiclePickup = (req,res) =>{
	let query = {
        text: `
        	SELECT 
        		i_idvehicle_pickup
        	FROM vehicle_pickup
        	WHERE i_idvehicle = $1 AND i_idpartner_pickup = $2 AND b_active IS TRUE;
        `,

        values: [req.i_idvehicle,req.i_idpartner_pickup],
    }

    return pool()
    .query(query)
    .then(response => response)
    .catch(err => {throw err})
}

const closePickup = (req,res) =>{
    let query = {
        text: `
            UPDATE vehicle_pickup
            SET 
                b_active = false,
                d_pickup = now()
            WHERE i_idpartner_pickup = $1
                AND i_idvehicle_pickup = $2;
        `,

        values: [req.i_idpartner_pickup, req.i_idvehicle_pickup],
    }

    return pool()
    .query(query)
    .then(response => response)
    .catch(err => {throw err})
}

const getOpenPickup = (req,res) =>{
    let query = {
        text: `
            SELECT 
                a.d_created_at::varchar,
                a.v_user_created,
                a.i_cost_pickup,
                b.v_address,
                b.v_contact_name,
                b.v_contact_phone,
                c.v_name
            FROM vehicle_pickup a
            INNER JOIN partner_pickup b
                ON a.i_idpartner_pickup=b.i_idpartner_pickup
            INNER JOIN partners c
                ON b.i_idpartner=c.i_idpartner
            WHERE a.b_active IS TRUE;
        `,

        values: [],
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
		values : [req.country]
	}

	return pool()
	.query(query)
	.then(response => response.rows)
	.catch(err => {throw err})
}

const getDriver = async(req, res) => {

	let query = {
		text : `
                SELECT 
                    a.i_idvehicle,
                    v_ppu,
                    v_names,
                    c_latitude,
                    c_longitude,
                    count(DISTINCT i_iditem) total
                FROM vehicles a
                INNER JOIN users b
                    ON a.i_iduser_driver=b.i_iduser
                LEFT JOIN vehicle_pickup c
                    ON a.i_idvehicle = c.i_idvehicle
                LEFT JOIN items d
                    ON c.i_idvehicle_pickup=d.i_idvehicle_pickup
                WHERE i_iduser_level = 2
                                    AND c_latitude IS NOT NULL AND c_longitude IS NOT NULL
                GROUP BY a.i_idvehicle,
                    v_ppu,
                    v_names,
                    c_latitude,
                    c_longitude`,
		values : []
	}

	return pool()
	.query(query)
	.then(response => response.rows)
	.catch(err => {throw err})
}

const getListPickup = (req,res) => {
 let query = {
    text : `SELECT 
                c.v_name,
                b.v_pickup_code,
                b.v_contact_name,
                b.v_contact_phone,
                b.v_address,
                a.i_idpartner,
                a.i_idpartner_pickup,
                b.c_latitude,
                b.c_longitude,
                count(*) total,
                sum(case when i_idvehicle_pickup != 0 then 1 else 0 end) assign_total
            FROM items a
            INNER JOIN partner_pickup b
                ON a.i_idpartner_pickup=b.i_idpartner_pickup
            INNER JOIN partners c
                ON b.i_idpartner=c.i_idpartner
            WHERE d_date_pickup is null
                AND i_idvehicle_pickup = 0
            GROUP BY c.v_name,
                b.v_pickup_code,
                b.v_contact_name,
                b.v_contact_phone,
                b.v_address,
                a.i_idpartner,
                a.i_idpartner_pickup,
                b.c_latitude,
                b.c_longitude
            `,
            values : []
        }
    
        return pool()
        .query(query)
        .then(response => response.rows)
        .catch(err => {throw err})
}

const getListAddressPickup = (req,res) => {
 let query = {
    text : `SELECT 
                c.v_name,
                b.v_pickup_code,
                b.v_contact_name,
                b.v_contact_phone,
                b.v_address,
                b.i_idpartner,
                b.i_idpartner_pickup,
                b.c_latitude,
                b.c_longitude,
                count(*) total,
                1 assign_total
            FROM partner_pickup b
            INNER JOIN partners c
                ON b.i_idpartner=c.i_idpartner
            WHERE 
                b.c_latitude IS NOT NULL AND
                b.c_longitude IS NOT NULL
            GROUP BY c.v_name,
                b.v_pickup_code,
                b.v_contact_name,
                b.v_contact_phone,
                b.v_address,
                b.i_idpartner,
                b.i_idpartner_pickup,
                b.c_latitude,
                b.c_longitude
            `,
            values : []
        }
    
        return pool()
        .query(query)
        .then(response => response.rows)
        .catch(err => {throw err})
}


const assigned = async(req, res) => {

	let query = {
		text : `INSERT INTO vehicle_pickup(i_idvehicle,i_idpartner_pickup) 
                VALUES ($1,$2)
                RETURNING i_idvehicle_pickup`,
		values : [req.idvehicle,req.idpartner_pickup]
	}

	return pool()
	.query(query)
	.then(response => response.rows)
	.catch(err => {throw err})
}

const assingPickupItems = async(req, res) => {

	let query = {
		text : `UPDATE items
                SET 
                    i_idvehicle_pickup = $1
                WHERE d_date_pickup is null
                    AND i_idvehicle_pickup = 0
                    AND i_idpartner_pickup = $2`,
		values : [req.idvehicle_pickup,req.idpartner_pickup]
	}

	return pool()
	.query(query)
	.then(response => response)
	.catch(err => {throw err})
}

const updateTotalItems = async(total, idvehicle_pickup) => {

	let query = {
		text : `UPDATE vehicle_pickup
                SET 
                    i_total_items = $1
                WHERE i_idvehicle_pickup = $2`,
		values : [total, idvehicle_pickup]
	}

	return pool()
	.query(query)
	.then(response => response)
	.catch(err => {throw err})

}

const chargeInLoad = async(req, res) => {

	let query = {
		text : `SELECT 
                    v_partner_code, 
                    d_date_pickup
                FROM items 
                WHERE i_idvehicle_pickup = $1`,
		values : [req.i_idvehicle_pickup]
	}

	return pool()
	.query(query)
	.then(response => response)
	.catch(err => {throw err})

}

const provePickup = async(req, res) => {

	let query = {
		text : `SELECT 
                    count(*) total,
                    sum(case when d_date_pickup is null then 0 else 1 end) loaded
                FROM items 
                WHERE i_idpartner_pickup = $1
                AND i_idvehicle_pickup = $2;
        `,

        values: [req.i_idpartner_pickup, req.i_idvehicle_pickup],
	}

	return pool()
	.query(query)
	.then(response => response)
	.catch(err => {throw err})

}

const updateLabel = async(req, res) => {

    let query = {
        text: `
            UPDATE items
            SET
                v_lidia_sku = $1
            WHERE v_partner_code = $2 AND i_idpartner = $3
        `,

        values: [req.qr_code, req.v_partner_code, req.i_idpartner],
    }
    
    return pool()
    .query(query)
    .then(response => response)
    .catch(err => {throw err})

}

const availableLabel = async(req, res) => {

    let query = {
        text: `
            SELECT v_lidia_label,i_iditem
            FROM generated_labels
            WHERE v_lidia_label = $1
        `,

        values: [req.qr_code],
    }
    
    return pool()
    .query(query)
    .then(response => response)
    .catch(err => {throw err})

}

const updateLabelGenerated = async(req, id, res, jwt) => {

    let query = {
        text: `
            UPDATE generated_labels
            SET i_iditem = $1,
            i_idpartner = $2,
            v_user_assign = $3,
            d_assigned_at = now()
            WHERE v_lidia_label = $4
        `,

        values: [id, req.i_idpartner, jwt.username, req.qr_code],
    }
    
    return pool()
    .query(query)
    .then(response => response)
    .catch(err => {throw err})

}

const getIdItem = async(req, res) => {

    let query = {
        text: `
            SELECT i_iditem
            FROM items
            WHERE v_partner_code = $1 AND i_idpartner = $2 
        `,

        values: [req.v_partner_code, req.i_idpartner],
    }
    
    return pool()
    .query(query)
    .then(response => response)
    .catch(err => {throw err})

}

const generateLabel = async(req, res, jwt) => {

    let query = {
        text : `SELECT * FROM func_create_labels($1,$2,$3);`,
        values: [req.quantity,req.i_idpartner,jwt.username],
    }

    return pool()
    .query(query)
    .then(response => response)
    .catch(err => {throw err})

}

module.exports = {
	findLoad,
    updateLoad,
	load,
	getPendingLoad,
	updateReceive,
	updateReceiveOffline,
	getVehicleActive,
	getPartnerActive,
	getPartnerPickupActive,
	createAssignPickup,
	getPickupByVehicle,
	validateVehiclePickup,
    closePickup,
    getOpenPickup,
    viewZone,
    getPartnerPickup,
    getPartnerPickupById,
    getDriver,
    getListPickup,
    assigned,
    assingPickupItems,
    updateTotalItems,
    chargeInLoad,
    provePickup,
    getListAddressPickup,
    updateLabel,
    availableLabel,
    updateLabelGenerated,
    getIdItem,
    generateLabel
}