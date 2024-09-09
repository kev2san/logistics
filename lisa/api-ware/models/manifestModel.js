const pool = require('./connectModel')


const  manifestPartner = async(req,res,jwt) => {
	let query = {
        text: `
        SELECT  
            j_manifest_columns::json,
            v_name
        FROM partners
        WHERE i_idpartner = $1
        LIMIT 1;
        `,
        
        values: [req],
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


const  pickupsPartner = async(req,res,jwt) => {
	let query = {
        text: `
        SELECT 
            i_idpartner_pickup,
			i_idpartner,
			i_iddistrict,
			i_idregion,
			v_partner_pickup,
			v_address,
			v_pickup_code
        FROM partner_pickup
        WHERE i_idpartner = $1
        AND b_active = 'true';
        `,
        
        values: [req],
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

const insertManifest = async(req,res,jwt) => {
   let withdrawDate = req.withdraw == 'false' ? '2000-01-01' : req.withdrawDate
    let query = {
        text: `
        SELECT * FROM fn_upload_manifest_json($1,$2,$3,$4,$5,$6,$7);
        `,
        
        values: [req.jdata, req.jcolumns, jwt.idpartner, req.filename, req.withdraw,withdrawDate, req.pickup],
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
	manifestPartner,
    insertManifest,
    pickupsPartner
}