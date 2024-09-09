const pool = require('./connectModel')


const  dispatchToDelivery = async(req,res,jwt) => {
    
	let query = {
        text: `
        SELECT  
            i_iddispatch, 
            v_guide, 
            v_guide_partner, 
            v_guide_lidia, 
            i_idpartner, 
            t_contact_name,
            t_contact_address, 
            t_contact_phone,
            t_contact_email, 
            t_commentary,
            UPPER(TRIM(t_contact_district)) as t_contact_district,
            i_items, 
            i_pending_items, 
            c_delivery_latitude, 
            c_delivery_longitude,
            i_dispatch_order,
            i_order_pick,
            v_zone,
            i_idplanner
        FROM dispatches
        WHERE v_ppu_assigned = $1
        AND b_active = 't'  
        AND d_date_delivered IS NULL
        ORDER BY i_order_pick asc;
        `,
        
        values: [req.v_ppu],
    }

    return pool()
    .query(query)
    .then(response => response)
    .catch(error => {
		console.log(error)
    	res.status(500).send({
   	      	message : 'Ocurrio un error'
		})
	})
}


const  dispatchItem = async(req,res,jwt) => {

	let query = {
        text: `
            SELECT 
                b.v_lidia_sku,
                a.i_dispatch_order,
                a.i_order_pick,
                a.i_iddispatch,
                a.v_guide,
                a.v_guide_partner,
                a.v_guide_lidia,
                a.i_idpartner,
                a.t_contact_name,
                a.t_contact_address,
                a.t_contact_phone,
                a.t_contact_district,
                a.t_commentary,
                a.i_idpickup_partner,
                a.i_items,
                b.i_iditem,
                b.v_partner_code,
                b.i_idpartner_pickup,
                a.c_delivery_latitude,
                a.c_delivery_longitude,
                b.b_ml,
                b.b_qr_check
            FROM dispatches a
            INNER JOIN items b ON a.i_iddispatch = b.i_iddispatch
            WHERE a.i_iddispatch =$1
            AND a.d_date_delivered is null;
        `,

        values: [req.iddispatch],
    }

    return pool()
    .query(query)
    .then(response => response)
    .catch(error => {
		console.log(error)
    	res.status(500).send({
   	      	message : 'Ocurrio un error'
		})
	})
}



const updatePhotosItems = async (req,res,jwt) => {

	let query = {
		text: ` UPDATE items 
				SET t_deliver_photos = $1,
                    d_updated_at                = NOW(),
                    d_date_delivered            = NOW(),
                    v_userppu_delivered         = $4,
                    v_ppu_delivered             = $3
				WHERE i_iditem = $2`,

	    values: [req.filepath, 
                req.iditem, 
                req.ppu_delivered, 
                req.userppu_delivered
        ]
	}
	return pool()
    .query(query)
    .then(response => response.rowCount)
    .catch(error => {
        console.log(error)
    	res.status(500).send({
	      message : 'Ocurrio un error'
	    })
    })
} 


const updatePhotosDispatch = async (req,res,jwt) => {

	let query = {
		text: ` UPDATE dispatches 
                SET t_address_photos            = $2,
                    t_deliver_photos            = $3,
                    v_delivery_identification   = $4,
                    v_delivery_name             = $5,
                    i_iddelivery_type           = $6,
                    v_userppu_delivered         = $7,
                    v_ppu_delivered             = $8,
                    t_delivery_comment          = $9,
                    d_updated_at                = NOW(),
                    d_date_delivered            = NOW()
				WHERE i_iddispatch = $1`,

	    values: [req.iddispatch, 
                req.fileDispatchAddress, 
                req.fileDispatchPhoto, 
                req.delivery_identification, 
                req.delivery_name,
                req.delivery_type,
                req.userppu_delivered,
                req.ppu_delivered,
                req.delivery_comment
                
        ]
	}
	return pool()
    .query(query)
    .then(response => response.rowCount)
    .catch(error => {
        console.log(error)
    	res.status(500).send({
	      message : 'Ocurrio un error'
	    })
    })
} 

const reportDispatch = async(req,res,jwt) => {

	let query = {
        text: `
        SELECT
            a.i_iddispatch, 
            a.i_idpartner,
            a.v_userppu_delivered, 
            a.v_ppu_delivered,
            a.v_delivery_identification,
            a.v_delivery_name,
            b.v_delivery_type_name as v_delivery_type,
            a.d_date_delivered,
            a.t_address_photos,
            a.t_deliver_photos as t_deliver_photos_dispatch,
            a.v_guide,
            a.d_date_delivered::text AS d_date_delivered,
            a.v_guide_partner,
            COUNT(DISTINCT c.i_iditem) as q_items
        FROM dispatches a 
        LEFT JOIN delivery_type b ON a.i_iddelivery_type = b.i_iddelivery_type
        INNER JOIN items c ON a.i_iddispatch = c.i_iddispatch
        WHERE a.d_date_delivered::date BETWEEN $1 AND $2
        AND a.i_idpartner = $3
        GROUP BY 
            a.i_iddispatch, 
            a.i_idpartner,
            a.v_userppu_delivered, 
            a.v_ppu_delivered,
            a.v_delivery_identification,
            a.v_delivery_name,
            b.v_delivery_type_name,
            a.d_date_delivered,
            a.t_address_photos,
            a.t_deliver_photos,
            a.v_guide,
            a.d_date_delivered::text,
            a.v_guide_partner;
        `,

        values: [req.start_date,req.end_date,jwt.idpartner],
    }
    return pool()
    .query(query)
    .then(response => response)
    .catch(error => {
		console.log(error)
    	res.status(500).send({
   	      	message : 'Ocurrio un error'
		})
	})
}


const viewPhotos = async(req,res) => {

	let query = {
        text: `
        SELECT 
            a.i_iddispatch,
            b.i_iditem,
            a.v_guide,
            b.v_partner_code,
            SUBSTRING(a.t_address_photos,3,LENGTH(a.t_address_photos) ) as t_address_photos,
            SUBSTRING(a.t_deliver_photos,3,LENGTH(a.t_deliver_photos) ) as t_deliver_photos_dispatch,
            SUBSTRING(b.t_deliver_photos,3,LENGTH(b.t_deliver_photos) ) as t_deliver_photos_items
        FROM dispatches a 
        INNER JOIN items b ON a.i_iddispatch = b.i_iddispatch
        WHERE a.i_iddispatch = $1;
        `,

        values: [req.iddispatch],
    }
    return pool()
    .query(query)
    .then(response => response)
    .catch(error => {
		console.log(error)
    	res.status(500).send({
   	      	message : 'Ocurrio un error'
		})
	})
}

const getDeliveryTypes = async(req,res,jwt) => {

	let query = {
        text: `
        SELECT
            a.i_iddelivery_type, 
            a.v_delivery_type,
            a.v_delivery_type_name, 
            a.i_order,
            a.i_parent
        FROM delivery_type a 
        WHERE a.b_active = true 
        ORDER BY a.i_order ASC;
        `,
        // AND a.i_idpartner IN (0,$1)

        /// El 0 son todos los tipos de gestion de Ware, que deben de aplicar para cualquier partner
        values: [
            //jwt.idpartner
        ],
    }
    return pool()
    .query(query)
    .then(response => response)
    .catch(error => {
		console.log(error)
    	res.status(500).send({
   	      	message : 'Ocurrio un error'
		})
	})
}

const reportPending = async(req,res) => {

	let query = {
        text: `
        SELECT
            a.b_active,
            a.i_iddispatch, 
            a.i_idpartner,
            a.v_ppu_assigned,
            a.d_agreed_date::date::text,
            LEFT(a.d_created_at::timestamp(0)::text,16) AS d_created_at,
            a.v_guide_partner,
            e.v_partner_pickup,
            d.v_name,
            a.t_contact_name,
            a.t_contact_address,
            a.t_contact_district,
            a.t_contact_phone,
            a.t_contact_email,
            a.t_contact_latitude,
            a.t_contact_longitude,
            a.t_commentary,
            COUNT(DISTINCT c.i_iditem) as q_items
        FROM dispatches a 
        INNER JOIN items c ON a.i_iddispatch = c.i_iddispatch
        INNER JOIN partners d ON a.i_idpartner = d.i_idpartner
        LEFT JOIN partner_pickup e ON a.i_idpickup_partner = e.i_idpartner_pickup
        WHERE a.d_created_at::date BETWEEN $1 AND $2
        AND a.d_date_delivered IS NULL
        GROUP BY 
            a.b_active,
            a.i_iddispatch, 
            a.i_idpartner,
            a.v_ppu_assigned,
            a.d_agreed_date,
            a.d_created_at,
            a.v_guide_partner,
            e.v_partner_pickup,
            d.v_name,
            a.t_contact_name,
            a.t_contact_address,
            a.t_contact_district,
            a.t_contact_phone,
            a.t_contact_email,
            a.t_contact_latitude,
            a.t_contact_longitude,
            a.t_commentary;
        `,

        values: [req.start_date,req.end_date],
    }
    return pool()
    .query(query)
    .then(response => response)
    .catch(error => {
		console.log(error)
    	res.status(500).send({
   	      	message : 'Ocurrio un error'
		})
	})
}

const viewItems = async(req,res) => {

	let query = {
        text: `
        SELECT 
            b.i_iditem,
            b.v_sku,
            b.v_partner_code,
            LEFT(b.d_date_pickup::timestamp(0)::text,16) AS d_date_pickup,
            b.v_user_pickup,
            b.v_partner_size
        FROM dispatches a 
        INNER JOIN items b ON a.i_iddispatch = b.i_iddispatch
        WHERE a.i_iddispatch = $1;
        `,

        values: [req.iddispatch],
    }
    return pool()
    .query(query)
    .then(response => response)
    .catch(error => {
		console.log(error)
    	res.status(500).send({
   	      	message : 'Ocurrio un error'
		})
	})
}


const changeStatus = async (req, res,jwt) => {
    let query = {
       text : `SELECT * FROM fn_change_status_dispatch ($1,$2,$3)`,
       values : [req.id, req.status, jwt.username]
   }
   console.log(query)
   return pool()
   .query(query)
   .then(response => response)
   .catch(error => {
       res.status(500).send({
           message: 'Ocurrio un error'
       })
   })
}

module.exports = {
	dispatchItem,
    updatePhotosItems,
    updatePhotosDispatch,
    dispatchToDelivery,
    reportDispatch,
    viewPhotos,
    getDeliveryTypes,
    reportPending,
    viewItems,
    changeStatus
}