const pool = require('./connectModel')


const createVehicle = async (req, res, jwt) => {
	let query = {
        text: `
        	INSERT INTO vehicles(
        		i_idvehicle_type,
        		v_ppu,
        		n_cubic_cm,
        		d_technical_review,
        		d_circulation_permit,
                        i_year,
        		t_commentary,
        		v_user_created) 
        	VALUES (
        		$1,$2,$3,$4,$5,$6,$7,$8
        	) RETURNING i_idvehicle
        `,

        values: [req.idvehicle_type,
                req.ppu,
                req.cubicm,
                req.technicareview,
                req.ciculatiopermit,
                req.year,
                req.commentary,
                jwt.username],
        }

        return pool()
        .query(query)
        .then(response => response)
        .catch(err => {
    	        console.log(error)
    	        if (error.code == '23505'){
    		        return error.code
    	        }else{
			throw err
    	        }
        })
}

const createUser = async (req, res, jwt) => {
	let query = {
        text: `
        	INSERT INTO users(
        		i_iduser_level,
        		v_names,
        		v_surnames,
        		v_identification,
                v_email,
        		v_address,
        		v_user_created,
        		c_latitude,
        		c_longitude,
        		i_idregion,
        		i_iddistrict) 
        	VALUES (
        		$1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11
        	) RETURNING i_idvehicle
        `,

        values: [req.iduser_level,
        req.names,
        req.surnames,
        req.identification,
        req.email,
        req.address,
        jwt.username,
        req.latitude,
        req.longitude,
        req.region,
        req.district]
    }

    return pool()
    .query(query)
    .then(response => response)
    .catch(err => {
    	if (err.code == '23505'){
    		return err.code
    	}else{
		throw err
    	}

	})
}

const getRegion = async (req, res) => {
	let query = {
        text: `
        	SELECT i_idregion, v_name
        	FROM region
        	WHERE b_status IS TRUE
        `,

        values: [],
        }

        return pool()
        .query(query)
        .then(response => response)
        .catch(err => {throw err})
}

const getDistrict = async (req, res) => {
	let query = {
        text: `
        	SELECT i_iddistrict, v_name
        	FROM district
        	WHERE i_idregion = $1 AND b_status IS TRUE
        `,

        values: [req.idregion],
    }

        return pool()
        .query(query)
        .then(response => response)
        .catch(err => {throw err})
}

const showUsersCrews = async (req, res) => {
        let query = {
        text: `
                SELECT 
                        i_iduser,
                        i_iduser_level,
                        v_names,
                        v_surnames,
                        v_identification,
                        v_email,
                        v_address,
                        c_latitude,
                        c_longitude,
                        b_active
                FROM users
                WHERE i_iduser_level IN (1,2)
        `,

        values: [],
    }

        return pool()
        .query(query)
        .then(response => response)
        .catch(err => {throw err})
}

const changeStatusUser = async (req, res) => {
        let query = {
                text: `
                UPDATE users
                SET b_active = $1
                WHERE i_iduser = $2`,

                values: [req.active, req.iduser],
        }

        return pool()
        .query(query)
        .then(response => response)
        .catch(err => {throw err})
}

const changeStatusVehicle = async (req, res) => {
        let query = {
                text: `
                UPDATE vehicles
                SET b_active = $1
                WHERE i_idvehicle = $2`,

                values: [req.active, req.idvehicle],
        }

        return pool()
        .query(query)
        .then(response => response)
        .catch(err => {throw err})
}

const getUserDetail = async (req, res) => {
        let query = {
                text: `
                SELECT 
                        a.i_iduser_level,
                        a.v_names,
                        a.v_surnames,
                        a.v_identification,
                        a.v_email,
                        a.v_address,
                        a.c_latitude,
                        a.c_longitude,
                        a.i_idregion,
                        a.i_iddistrict,
                        b.v_name v_name_r,
                        c.v_name v_name_d
                FROM users a
                LEFT JOIN region b
                        ON a.i_idregion = b.i_idregion
                LEFT JOIN district c
                        ON a.i_iddistrict = c.i_iddistrict
                WHERE i_iduser = $1`,

                values: [req.iduser],
        }

        return pool()
        .query(query)
        .then(response => response)
        .catch(err => {throw err})
}

const editUserCrews = async (req, res) => {
        let query = {
                text: `
                UPDATE users
                SET
                        i_iduser_level = $1,
                        v_names = $2,
                        v_surnames = $3,
                        v_email = $4,
                        v_address = $5,
                        c_latitude = $6,
                        c_longitude = $7,
                        i_idregion = $8,
                        i_iddistrict = $9,
                        d_updated_at = now()
                WHERE i_iduser = $10`,

                values: [req.iduser_level,
                        req.names,
                        req.surnames,
                        req.email,
                        req.address,
                        req.latitude,
                        req.longitude,
                        req.idregion,
                        req.iddistrict,
                        req.iduser]
        }

        return pool()
        .query(query)
        .then(response => response)
        .catch(err => {throw err})
}

const getVehiclesWithCrew = async (req, res) => {
        let query = {
                text: `
                SELECT 
                        a.i_idvehicle,
                        a.v_ppu,
                        a.n_cubic_cm,
                        a.d_circulation_permit,
                        a.i_iduser_driver,
                        a.i_iduser_codriver,
                        b.v_name,
                        a.b_active,
			c.v_names || ' ' || c.v_surnames v_driver,
			d.v_names || ' ' || d.v_surnames v_codriver
                FROM vehicles a
                LEFT JOIN vehicle_type b
                        ON a.i_idvehicle_type=b.i_idvehicle_type
		LEFT JOIN users c
		        ON a.i_iduser_driver = c.i_iduser
		LEFT JOIN users d
			ON a.i_iduser_codriver = d.i_iduser
                `,

                values: [],
        }

        return pool()
        .query(query)
        .then(response => response)
        .catch(err => {throw err})
}

const getVehicleType = async (req, res) => {
        let query = {
                text: `
                SELECT 
                        i_idvehicle_type,
                        v_name
                FROM vehicle_type
                WHERE b_active IS TRUE
                `,

                values: [],
        }

        return pool()
        .query(query)
        .then(response => response)
        .catch(err => {throw err})
}

const getDrivers = async (req, res) => {
        let query = {
                text: `
                SELECT 
                        i_iduser,
                        i_iduser_level,
                        v_names,
                        v_surnames,
                        v_identification,
                        v_email,
                        v_address,
                        c_latitude,
                        c_longitude,
                        b_active
                FROM users
                WHERE i_iduser_level = $1
                `,

                values: [req.iduser_level],
        }

        return pool()
        .query(query)
        .then(response => response)
        .catch(err => {throw err})
}

const assignDriver = async (req, res) => {
        let query = {
                text: `
                UPDATE vehicles
                SET
                        i_iduser_driver = $1
                WHERE i_idvehicle = $2
                `,

                values: [req.iduser,req.idvehicle],
        }

        return pool()
        .query(query)
        .then(response => response)
        .catch(err => {throw err})
}

const assignCodriver = async (req, res) => {
        let query = {
                text: `
                UPDATE vehicles
                SET
                        i_iduser_codriver = $1
                WHERE i_idvehicle = $2
                `,

                values: [req.iduser,req.idvehicle],
        }

        return pool()
        .query(query)
        .then(response => response)
        .catch(err => {throw err})
}

const getVehicleDetail = async (req, res) => {
        let query = {
                text: `
                SELECT 
                        a.i_idvehicle,
                        a.v_ppu,
                        a.n_cubic_cm,
                        a.d_circulation_permit,
                        a.d_technical_review,
                        a.i_iduser_driver,
                        a.i_iduser_codriver,
                        a.d_created_at created_at_vehicle, 
                        b.v_name,
                        b.i_idvehicle_type,
                        a.b_active,
                        c.v_names || ' ' || c.v_surnames v_driver,
                        d.v_names || ' ' || d.v_surnames v_codriver
                FROM vehicles a
                LEFT JOIN vehicle_type b
                        ON a.i_idvehicle_type=b.i_idvehicle_type
                LEFT JOIN users c
                        ON a.i_iduser_driver = c.i_iduser
                LEFT JOIN users d
                        ON a.i_iduser_codriver = d.i_iduser
                WHERE a.i_idvehicle = $1
                `,

                values: [req.idvehicle],
        }

        return pool()
        .query(query)
        .then(response => response)
        .catch(err => {throw err})
}

const editVehicle = async (req, res) => {
	let query = {
        text: `
        	UPDATE vehicles
                SET
        		i_idvehicle_type = $1,
        		n_cubic_cm = $2,
        		d_technical_review = $3,
        		d_circulation_permit = $4,
                        i_year = $5,
        		t_commentary = $6,
        		d_updated_at = now()
        	WHERE i_idvehicle = $7
        `,

        values: [req.idvehicle_type,
                req.cubic_cm,
                req.technica_review,
                req.ciculation_permit,
                req.year,
                req.commentary,
                req.idvehicle],
        }

        return pool()
        .query(query)
        .then(response => response)
        .catch(err => {
    	        if (err.code == '23505'){
    		        return err.code
    	        }else{
                        throw err
    	        }
	})
}

module.exports = {
        createVehicle,
        createUser,
        getRegion,
        getDistrict,
        showUsersCrews,
        changeStatusUser,
        changeStatusVehicle,
        getUserDetail,
        editUserCrews,
        getVehicleType,
        getVehiclesWithCrew,
        getDrivers,
        assignDriver,
        assignCodriver,
        getVehicleDetail,
        editVehicle
}