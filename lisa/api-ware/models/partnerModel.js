const pool = require('./connectModel')

const  partnerList = async(req,res,jwt) => {
	let query = {
        text: `
        SELECT 
            a.i_idpartner,
            a.v_partner_identification,
            a.v_name,
            a.b_active,
            (a.d_created_at::timestamp(0))::text as d_created_at,
            a.v_legal_identification,
            a.v_adress,
            a.v_legal_name,
            a.v_contact_phone,
            a.v_contact_email,
            a.t_avatar,
            a.t_observation,
            a.t_site_url,
            a.v_user_partner,
            b.v_name as v_region,
            c.v_name as v_district
        FROM partners a
        LEFT JOIN region b ON a.i_idregion = b.i_idregion
        LEFT JOIN district c ON a.i_iddistrict = c.i_iddistrict;
        `
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

const partnerActiveList = async (req, res) => {
	let query = {
        text: `
        SELECT 
            a.i_idpartner,
            a.v_partner_identification,
            a.v_name,
            a.v_legal_identification,
            a.v_adress,
            a.v_legal_name
        FROM partners a
        WHERE a.b_active = 'true';
        `
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

const partnerAdd = async (req, res) => {
    let query = {
       text : `INSERT INTO partners(
                        v_partner_identification, 
                        v_name, 
                        v_legal_identification,
                        v_adress, 
                        v_legal_name, 
                        v_contact_phone, 
                        v_contact_email, 
                        v_user_partner, 
                        t_site_url, 
                        t_observation,
                        i_idregion,
                        i_iddistrict)
               VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
               RETURNING i_idpartner`,
       values : [req.v_partner_identification, req.v_name, req.v_legal_identification, req.v_adress, req.v_legal_name, req.v_contact_phone, req.v_contact_email,req.v_user_partner, req.t_site_url, req.t_observation, req.i_idregion, req.i_iddistrict]
   }

   return pool()
   .query(query)
   .then(response => response)
   .catch(error => {
       res.status(500).send({
           message: 'Ocurrio un error'
       })
   })
}

const partnerPickupList = async (req, res) => {
	let query = {
        text: `
        SELECT 
            c.v_name as region,
            d.v_name as district,
            b.v_name as partner,
            a.i_idpartner_pickup,
            a.i_idpartner,
            a.v_address,
            a.i_iddistrict,
            a.i_idregion,
            a.v_pickup_code,
            a.i_order,
            a.v_contact_name,
            a.v_contact_phone,
            a.v_contact_identification,
            a.b_active,
            (a.d_created_at::timestamp(0))::text as d_created_at,
            (a.d_updated_at::timestamp(0))::text as d_updated_at,
            a.i_idplan,
            a.t_observation,
            a.c_latitude,
            a.c_longitude,
            a.v_partner_pickup,
            a.v_contact_email
        FROM partner_pickup a
        INNER JOIN partners b ON a.i_idpartner = b.i_idpartner
        INNER JOIN region c ON a.i_idregion = c.i_idregion
        INNER JOIN district d ON a.i_iddistrict = d.i_iddistrict 
        ORDER BY 1;
        `
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

const  pickupById = async(req,res,jwt) => {
	let query = {
        text: `
        SELECT 
            a.i_idregion,
            a.i_iddistrict,
            c.v_name as region,
            d.v_name as district,
            b.v_name as partner,
            a.i_idpartner_pickup,
            a.i_idpartner,
            a.v_address,
            a.i_iddistrict,
            a.i_idregion,
            a.v_pickup_code,
            a.i_order,
            a.v_contact_name,
            a.v_contact_phone,
            a.v_contact_identification,
            a.b_active,
            (a.d_created_at::timestamp(0))::text as d_created_at,
            (a.d_updated_at::timestamp(0))::text as d_updated_at,
            a.i_idplan,
            a.t_observation,
            a.c_latitude,
            a.c_longitude,
            a.v_partner_pickup,
            a.v_contact_email
        FROM partner_pickup a
        INNER JOIN partners b ON a.i_idpartner = b.i_idpartner
        INNER JOIN region c ON a.i_idregion = c.i_idregion
        INNER JOIN district d ON a.i_iddistrict = d.i_iddistrict 
        WHERE a.i_idpartner_pickup = $1
        ORDER BY a.i_idpartner_pickup;
        `,
        values : [req.idpickup]
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

const partnerPickupAdd = async (req, res) => {
    let query = {
        text : `INSERT INTO partner_pickup(
                        i_idpartner, 
                        v_partner_pickup, 
                        v_pickup_code,
                        v_contact_identification, 
                        v_contact_name, 
                        v_contact_phone, 
                        v_contact_email, 
                        i_idregion, 
                        i_iddistrict, 
                        v_address,
                        c_latitude,
                        c_longitude)
               VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
               RETURNING i_idpartner_pickup`,
        values : [req.partner, req.v_partner_pickup, req.v_pickup_code, req.v_contact_identification, req.v_contact_name, req.v_contact_phone, req.v_contact_email,req.region, req.district, req.address, req.latitude, req.longitude]
   }
   return pool()
   .query(query)
   .then(response => response)
   .catch(error => {
       res.status(500).send({
           message: 'Ocurrio un error'
       })

   })
}

const pickupEdit = async (req, res) => {
    let query = {
       text : `UPDATE partner_pickup
                SET i_idpartner              = $1,
                    v_partner_pickup         = $2,
                    v_pickup_code            = $3,
                    v_contact_identification = $4,
                    v_contact_name           = $5,
                    v_contact_phone          = $6,
                    v_contact_email          = $7,
                    i_idregion               = $8,
                    i_iddistrict             = $9,
                    v_address                = $10,
                    c_latitude               = $11,
                    c_longitude              = $12,
                    d_updated_at             = NOW()
                WHERE i_idpartner_pickup     = $13`,
       values : [req.partner, req.v_partner_pickup, req.v_pickup_code, req.v_contact_identification, req.v_contact_name, req.v_contact_phone, req.v_contact_email, req.region, req.district, req.address, req.latitude, req.longitude, req.i_idpartner_pickup]
   }
   return pool()
   .query(query)
   .then(response => response)
   .catch(error => {
       res.status(500).send({
           message: 'Ocurrio un error'
       })
   })
}

const partnerInactive = async (req, res) => {
    let query = {
       text : `UPDATE partners 
                SET b_active = 'false' ,
                    d_updated_at = NOW()
                WHERE i_idpartner = $1`,
       values : [req.i_idpartner]
   }
   return pool()
   .query(query)
   .then(response => response)
   .catch(error => {
       res.status(500).send({
           message: 'Ocurrio un error'
       })
   })
}

const pickupInactive = async (req, res) => {
    let query = {
       text : ` UPDATE partner_pickup 
                SET b_active = $2,
                    d_updated_at = NOW()
                WHERE i_idpartner_pickup = $1`,
       values : [req.i_idpartner, req.status]
   }
   return pool()
   .query(query)
   .then(response => response)
   .catch(error => {
       res.status(500).send({
           message: 'Ocurrio un error'
       })
   })
}


const sizesActive = async (req, res) => {
	let query = {
        text: `
        SELECT 
            a.i_idsize,
            a.v_size,
            a.d_created_at,
            a.d_updated_at,
            a.b_active,
            a.i_order
        FROM sizes a
        WHERE a.b_active = true
        ORDER BY a.i_order ASC;
        `
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

const partnerPriceAdd = async (req, res, jwt) => {
    let query = {
       text : `SELECT * FROM fn_create_partner_price($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
       values : [req.n_price, req.n_cost, req.n_m3_start, req.n_m3_end, req.n_kg_start, req.n_kg_end, req.i_idsize, req.i_idpartner, jwt.username],
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


const partnerPriceList = async (req, res) => {
	let query = {
        text: `
        SELECT  c.v_size, 
				b.v_name,
				a.n_price, 
				a.n_cost, 
				a.n_m3_start, 
				a.n_m3_end, 
				a.n_kg_start, 
				a.n_kg_end, 
				a.b_active, 
				a.d_created_at::timestamp(0)::text, 
				a.d_updated_at::timestamp(0)::text, 
				a.v_user_created,
                a.i_idprice_partner
        FROM price_partner a
        INNER JOIN partners b ON a.i_idpartner = b.i_idpartner 
        INNER JOIN sizes c ON a.i_idsize = c.i_idsize
        ORDER BY a.d_created_at ASC;
        `
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

const partnerPriceInactive = async (req, res, jwt) => {
    let query = {
       text : `UPDATE price_partner 
                SET b_active        = 'false' ,
                    d_updated_at    = NOW(),
                    v_user_updated  = $2
                WHERE i_idprice_partner = $1`,
       values : [req.i_idprice_partner, jwt.username]
   }
   return pool()
   .query(query)
   .then(response => response)
   .catch(error => {
       res.status(500).send({
           message: 'Ocurrio un error'
       })
   })
}

const getPickupByPartner = async (req, res) => {

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
                AND b.b_active IS TRUE
                AND b.i_idpartner = $1;
        `,

        values: [req.idpartner],
    }

    return pool()
    .query(query)
    .then(response => response)
    .catch(err => {throw err})
}

const periodPartnerPay = async (req, res) => {
    let where = (req.pickup == 'all') ? `` : `AND i_idpickup_partner = ${req.pickup}` 
	let query = {
        text: `
            SELECT DISTINCT LEFT(a.d_date_delivered::text,7) as period 
                FROM dispatches a 
            WHERE a.d_date_delivered IS NOT NULL
            AND  a.i_idpartner = $1
            ${where};
            `,

        values: [req.partner],
    }

    return pool()
    .query(query)
    .then(response => response)
    .catch(err => {throw err})
}

const reportPartnerPay = async (req, res) => {
    let wherepickup = (req.pickup == 'all') ? `` : `AND a.i_idpickup_partner = ${req.pickup} `
    let whereperiod = (req.period == 'all') ? `` : `AND LEFT(a.d_date_delivered::text,7) = '${req.period}' ` 
 
	let query = {
        text: `
            SELECT DISTINCT 
                a.d_date_delivered::date::text AS date_delivered,
                SUM(a.n_price) AS n_price, 
                SUM(a.n_cost) AS n_cost,
                ( SUM(a.n_price) - SUM(a.n_cost) )::numeric(32,6) as profit,
                COUNT(DISTINCT a.i_iddispatch) as q_dispatches,
                COUNT(DISTINCT b.i_iditem) as q_items
            FROM dispatches  a
            INNER JOIN items b ON a.i_iddispatch = b.i_iddispatch
            WHERE a.d_date_delivered IS NOT NULL
            AND   a.i_idpartner = $1
            ${wherepickup}
            ${whereperiod}
            GROUP BY a.d_date_delivered::date;
            `,

        values: [req.partner],
    }

    return pool()
    .query(query)
    .then(response => response)
    .catch(err => {throw err})
}

module.exports = {
    partnerList,
    partnerAdd,
    partnerInactive,
    partnerActiveList,
    partnerPickupAdd,
    partnerPickupList,
    pickupInactive,
    pickupById,
    pickupEdit,
    sizesActive,
    partnerPriceAdd,
    partnerPriceList,
    partnerPriceInactive,
    getPickupByPartner,
    periodPartnerPay,
    reportPartnerPay
}