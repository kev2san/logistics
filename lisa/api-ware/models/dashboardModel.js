const pool = require('./connectModel')

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

        values: [req.i_idpartner],
    }

    return pool()
    .query(query)
    .then(response => response)
    .catch(err => {throw err})
}

const getDashboardPartnerIndicator = async (req, res) => {
    let where = (req.i_idpartner_pickup != '0') ? ` AND a.i_idpartner_pickup = ${req.i_idpartner_pickup}` : ` AND a.i_idpartner = ${req.i_idpartner}` 
	
    let query = {
        text: `
            select 
                SUM(case when b.i_iddelivery_type = 3 then 1 else 0 end)::integer not_delivered,
                SUM(case when a.d_date_delivered is not null and a.d_date_returned is null and a.d_date_lost is null and b.i_iddelivery_type != 3 then 1 else 0 end) delivered,
                SUM(case when a.d_date_delivered is null and a.d_date_returned is null and a.d_date_lost is null then 1 else 0 end) pending,
                SUM(case when a.d_date_delivered is not null and a.d_date_returned is not null then 1 else 0 end) false_delivery,
                SUM(case when a.d_date_delivered is null and a.d_date_returned is not null and a.d_date_lost is null then 1 else 0 end) returned,
                SUM(case when a.d_date_delivered is null and a.d_date_returned is null and a.d_date_lost is not null then 1 else 0 end) lost,
                count(*) total
            from items a
            INNER JOIN dispatches b
                ON a.i_iddispatch=b.i_iddispatch
            WHERE to_char(a.d_created_at::date, 'MM') = to_char(now()::date, 'MM')
                ${where}
        `,

        values: [],
    }

    return pool()
    .query(query)
    .then(response => response)
    .catch(err => {throw err})
}

const getDashboardGraphMonth = async (req, res) => {
    let where = (req.i_idpartner_pickup != '0') ? ` AND a.i_idpartner_pickup = ${req.i_idpartner_pickup}` : ` AND a.i_idpartner = ${req.i_idpartner}` 
	
    let query = {
        text: `
        SELECT 
            to_char(a.d_created_at::date, 'DD') d_created_at,
            SUM(case when a.d_date_delivered is not null and a.d_date_returned is null and a.d_date_lost is null  and b.i_iddelivery_type != 3 then 1 else 0 end)::integer delivered,
            SUM(case when b.i_iddelivery_type = 3 then 1 else 0 end)::integer not_delivered,

            SUM(case when a.d_date_delivered is null and a.d_date_returned is null and a.d_date_lost is null then 1 else 0 end)::integer pending,
            SUM(case when a.d_date_delivered is not null and a.d_date_returned is not null then 1 else 0 end)::integer false_delivery,
            SUM(case when a.d_date_delivered is null and a.d_date_returned is not null and a.d_date_lost is null then 1 else 0 end)::integer returned,
            SUM(case when a.d_date_delivered is null and a.d_date_returned is null and a.d_date_lost is not null then 1 else 0 end)::integer lost,
            count(*)::integer total
        FROM items a
        INNER JOIN dispatches b
            ON a.i_iddispatch=b.i_iddispatch
        WHERE to_char(a.d_created_at::date, 'MM') = to_char(now()::date, 'MM')
        ${where}
        GROUP BY a.d_created_at::date
        ORDER BY a.d_created_at::date ASC
        `,
        values: [],
    }

    return pool()
    .query(query)
    .then(response => response)
    .catch(err => {throw err})
}

const getDashboardGraphMonthDetail = async (req, res) => {
    let where = (req.i_idpartner_pickup != '0') ? ` AND a.i_idpartner_pickup = ${req.i_idpartner_pickup}` : ` AND a.i_idpartner = ${req.i_idpartner}` 
	
    let query = {
        text: `
        SELECT 
            a.i_iditem,
            a.v_partner_code item,
            a.v_guide_partner dispatch,
            CASE    
                    WHEN a.d_date_delivered is null and a.d_date_returned is null and a.d_date_lost is null THEN 'Pendiente'
                    WHEN a.d_date_delivered is not null and a.d_date_returned is not null THEN 'Falsa Entrega'
                    WHEN a.d_date_delivered is null and a.d_date_returned is not null and a.d_date_lost is null THEN 'Devuelto'
                    WHEN a.d_date_delivered is null and a.d_date_returned is null and a.d_date_lost is not null THEN 'Merma'
                    ELSE c.v_delivery_type_name 
            END status,
            to_char(CASE WHEN a.d_date_delivered is not null and a.d_date_returned is null and a.d_date_lost is null THEN a.d_date_delivered
                    WHEN a.d_date_delivered is null and a.d_date_returned is null and a.d_date_lost is null THEN a.d_created_at
                    WHEN a.d_date_delivered is not null and a.d_date_returned is not null THEN a.d_date_returned
                    WHEN a.d_date_delivered is null and a.d_date_returned is not null and a.d_date_lost is null THEN a.d_date_returned
                    WHEN a.d_date_delivered is null and a.d_date_returned is null and a.d_date_lost is not null THEN a.d_date_lost
            END, 'YYYY-MM-DD HH24:MI:SS') date_status
        FROM items a
        INNER JOIN dispatches b
            ON a.i_iddispatch=b.i_iddispatch
        LEFT JOIN delivery_type c 
            ON c.i_iddelivery_type = b.i_iddelivery_type

        WHERE to_char(a.d_created_at::date, 'MM') = to_char(now()::date, 'MM')
            ${where}
        ORDER BY a.d_created_at ASC
        `,

        values: [],
    }

    return pool()
    .query(query)
    .then(response => response)
    .catch(err => {throw err})
}


const periodPartner = async (req, res,jwt) => {
    let where = (req.pickup == 'all') ? `` : `AND i_idpickup_partner = ${req.pickup}` 
	let query = {
        text: `
            SELECT DISTINCT LEFT(a.d_date_delivered::text,7) as period 
                FROM dispatches a 
            WHERE a.d_date_delivered IS NOT NULL
            AND  a.i_idpartner = $1
            ${where};
            `,

        values: [jwt.idpartner],
    }

    return pool()
    .query(query)
    .then(response => response)
    .catch(err => {throw err})
}

const reportPartner = async (req, res, jwt) => {
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

        values: [jwt.idpartner],
    }
    return pool()
    .query(query)
    .then(response => response)
    .catch(err => {throw err})
}


const viewPhotosItem = async(req,res) => {

	let query = {
        text: `
        SELECT 
            a.i_iddispatch,
            a.v_guide_partner,
            b.i_iditem,
            a.v_guide,
            b.v_partner_code,
            SUBSTRING(a.t_address_photos,3,LENGTH(a.t_address_photos) ) as t_address_photos,
            SUBSTRING(a.t_deliver_photos,3,LENGTH(a.t_deliver_photos) ) as t_deliver_photos_dispatch,
            SUBSTRING(b.t_deliver_photos,3,LENGTH(b.t_deliver_photos) ) as t_deliver_photos_items
        FROM dispatches a 
        INNER JOIN items b ON a.i_iddispatch = b.i_iddispatch
        WHERE b.i_iditem = $1;
        `,

        values: [req.iditem],
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


module.exports = {
    getPartner,
    getPickupByPartner,
    getDashboardPartnerIndicator,
    getDashboardGraphMonth,
    getDashboardGraphMonthDetail,
    periodPartner,
    reportPartner,
    viewPhotosItem
}