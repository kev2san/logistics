const pool = require('./connectModel')

const searchUser = async (req,res) => {
	let query = {
        text: `
			SELECT 
					a.* , 
					b.v_ppu
			FROM users a
			LEFT JOIN vehicles b ON a.i_iduser = b.i_iduser_driver
			WHERE a.v_user = $1
        `,

        values: [req.v_user],
    }

    return pool()
    .query(query)
    .then(response => response)
    .catch(err => {throw err})
}

const searchUserbyid = async (req,res) => {

	let query = {
        text: `
        	SELECT * 
			FROM users
			WHERE v_user = $1
        `,

        values: [req.v_user],
    }

    return pool()
    .query(query)
    .then(response => response)
    .catch(err => {throw err})
}

const register = async (req,res) => {
	let query = {
		text: `INSERT INTO users(v_user, v_names, v_surnames, v_email, v_password) 
				VALUES (
					$1,$2,$3,$4,$5
                ) RETURNING i_iduser`,

	    values: [req.v_user, req.v_names, req.v_surnames, req.v_email, req.v_passwordEncrypted]
	}
	return pool()
    .query(query)
    .then(response => response)
    .catch(err => {throw err})
}

const updateToken = async (req,res) => {
	const {table, token, id} = req
	const idfilter = table == 'users' ? 'iduser' : 'idcrew'
	let query = {
		text: ` UPDATE ${table} 
				SET token = $1
				WHERE ${idfilter} = $2`,

	    values: [token, id]
	}
	return pool()
    .query(query)
    .then(response => 
        response.rows
    )
    .catch(err => {throw err})
} 

const updatePassword = async (req,res) => {
	console.log(req.body)
	const {iduser,table, passwordUpdate} = req.body
	const idfilter = table == 'users' ? 'iduser' : 'idcrew'

 
	let query = {
		text: ` UPDATE ${table}
				SET password = $1,
					updated_at = now()
				WHERE ${idfilter} = $2 
				 `,

	    values: [passwordUpdate, iduser]
		
	}

	return pool()
    .query(query)
    .then(response => 
        response.rows
    )
    .catch(err => {throw err})
} 



const searchAssociatedVehicle = async (req,res) => {
	const idfilter = req.table == 'users' ? 'b.iduser' : 'b.idcrew'
	let query = {
		text : `SELECT a.ppu,a.idvehicle
				FROM vehicle a
				INNER JOIN crew b
				 ON a.crew = b.idcrew 
				WHERE ${idfilter} = $1`,
		values : [req.iduser]
	}

	return pool()
	.query(query)
	.then(response => response.rows)
	.catch(err => {throw err})
}




const getModules = async (user_level, res) => {
	let query = {
		text : `SELECT * 
		FROM permission_modules a
		INNER JOIN modules b
			ON a.i_idmodules=b.i_idmodules
		WHERE a.i_iduser_level = $1
			AND b.b_status IS TRUE`,
		values : [user_level]
	}

	return pool()
	.query(query)
	.then(response => response.rows)
	.catch(err => {throw err})
}

module.exports = {
	searchUser,
	register,
	updateToken,
	searchAssociatedVehicle,
	updatePassword,
	searchUserbyid,
	getModules
}