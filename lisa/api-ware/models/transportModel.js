const pool = require('./connectModel')


const  disponibilityCheck = async(req,res,jwt) => {
	let query = {
        text: `
        SELECT 
            a.i_iddisponibility,
            a.v_user,
            a.v_userppu,
            a.d_disponibility,
            a.d_created_at
        FROM users_disponibility a
        WHERE a.v_user = $1
        AND   a.d_disponibility::date =  (NOW() at time zone 'America/Santiago' + interval  '1'  day)::date
        AND   a.b_status = 'true';
        `,
        
        values: [req.username],
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

const disponibilityAdd = async (req, res) => {
    let query = {
       text : `INSERT INTO users_disponibility(v_user, v_userppu, d_disponibility)
               SELECT $1,$2, (NOW() at time zone 'America/Santiago' + interval  '1'  day)::date
               RETURNING i_iddisponibility`,
       values : [req.username,req.userppu]
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



const  disponibilityGet = async(req,res,jwt) => {
	let query = {
        text: `
        SELECT 
            a.i_iddisponibility,
            b.v_identification,
            a.v_user,
            a.v_userppu,
            a.d_disponibility::date::text as d_disponibility,
            a.d_created_at::timestamp(0)::text as d_created_at,
            a.b_status,
            b.v_names,
            b.v_surnames,
            b.v_address,
            b.v_email,
            b.n_phone
        FROM users_disponibility a
        INNER JOIN users b ON a.v_user = b.v_user
        WHERE a.d_disponibility = $1;
        `,
        
        values: [req.search_date],
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

const disponibilityInactive = async (req, res) => {
    let query = {
       text : `UPDATE users_disponibility 
                SET b_status = 'false' 
                WHERE i_iddisponibility = $1`,
       values : [req.i_iddisponibility]
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

const  incomeData = async(req,res,jwt) => {
	let query = {
        text: `
        SELECT  SUM(total_income_delivered)::integer total_income_delivered , 
                SUM(total_delivered)::integer total_delivered,
                SUM(total_income_pickup)::integer total_income_pickup,
                SUM(total_pickup)::integer total_pickup
        FROM (
				SELECT 
                    i_iddispatch as id_char,
                    SUM(n_total_income) AS total_income_delivered , 
                    COUNT(DISTINCT i_iddispatch) AS total_delivered, 
                    0 AS total_income_pickup, 
                    0 AS total_pickup
				FROM dispatches 
				WHERE v_ppu_delivered = $1
				AND LEFT(d_date_delivered::TEXT,7) = $2
				GROUP BY i_iddispatch
				UNION 
				SELECT 
                    a.i_idvehicle_pickup AS id_char,
                    0 AS total_income_delivered,
                    0 AS total_delivered,
                    a.i_cost_pickup AS total_income_pickup,
                    COUNT(DISTINCT a.i_idvehicle_pickup) AS total_pickup
				FROM vehicle_pickup a
				INNER JOIN vehicles b ON a.i_idvehicle = b.i_idvehicle
				INNER JOIN items c ON a.i_idvehicle_pickup = c.i_idvehicle_pickup
				WHERE c.v_ppu_pickup = $1
				AND LEFT(d_date_pickup::TEXT,7) =$2
				GROUP BY a.i_idvehicle_pickup, a.i_cost_pickup
			) as char_income
        `,
        
        values: [req.ppu,req.period],
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


const  incomePeriod= async(req,res,jwt) => {
	let query = {
        text: `
        SELECT DISTINCT period
        FROM (
				SELECT 
					LEFT(d_date_delivered::TEXT,7) AS period
				FROM dispatches 
				WHERE v_ppu_delivered = $1
				GROUP BY LEFT(d_date_delivered::TEXT,7)
				UNION 
				SELECT 
					LEFT(d_date_pickup::TEXT,7) AS period   
				FROM vehicle_pickup a
				INNER JOIN vehicles b ON a.i_idvehicle = b.i_idvehicle
				INNER JOIN items c ON a.i_idvehicle_pickup = c.i_idvehicle_pickup
				WHERE c.v_ppu_pickup = $1
				GROUP BY  LEFT(d_date_pickup::TEXT,7)   
			) as period_income
        GROUP BY period
        ORDER BY period DESC
        `,
        
        values: [req.ppu],
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
    disponibilityCheck,
    disponibilityAdd,
    disponibilityGet,
    disponibilityInactive,
    incomeData,
    incomePeriod
}