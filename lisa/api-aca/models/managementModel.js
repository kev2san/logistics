const pool = require('./connectModel')

const getDashOne = async (req, res) => {
	let query = {
        text: `
            SELECT 
                v_type,
                count(*) total
            FROM items a
            GROUP BY v_type
        `,

        values: [],
        }

        return pool()
        .query(query)
        .then(response => response)
        .catch(err => {console.log(err);throw err})
}

const getDataPropertys = async (req, res) => {
	let query = {
        text: `
            SELECT
                a.i_idproperty, 
                a.v_name,
                a.v_rent,
                a.v_type_rent,
                a.v_address,
                a.v_number,
                CASE WHEN b.b_mail_one IS NULL THEN false ELSE b_mail_one END as b_mail_one,
                CASE WHEN b.b_mail_two IS NULL THEN false ELSE b_mail_two END as b_mail_two,
                CASE WHEN b.b_mail_response_one IS NULL THEN false ELSE b_mail_response_one END as b_mail_response_one,
                CASE WHEN b.b_mail_response_two IS NULL THEN false ELSE b_mail_response_two END as b_mail_response_two
            FROM propertys a
            LEFT JOIN contact_form_propertys b
                ON a.i_idproperty=b.i_idproperty
            ORDER BY a.i_idproperty
        `,

        values: [],
        }

        return pool()
        .query(query)
        .then(response => response)
        .catch(err => {console.log(err);throw err})
}

const getDataPropertyID = async (req, res) => {
    let query = {
        text: `
            SELECT 
                i_idproperty,
                a.v_name,
                a.v_address,
                a.v_number,
                a.j_data,
                a.v_region,
                a.v_district,
                a.v_rent,
                a.v_type_rent,
                a.v_unit_number
            FROM propertys a
            WHERE i_idproperty = $1
        `,

        values: [req.id],
        }

        return pool()
        .query(query)
        .then(response => response)
        .catch(err => {console.log(err);throw err})
}

const insertContactForm = async (req,res) => {
    let query = {
        text: `
            INSERT INTO contact_form(v_full_name,v_mail) 
            VALUES ($1,$2) RETURNING i_idcontact
        `,

        values: [req.v_name,req.v_mail],
    }

    return pool()
    .query(query)
    .then(response => response)
    .catch(err => {console.log(err);throw err})
}

const insertContactFormPropertysOne = async (req,res,idcontact) => {
    let query = {
        text: `
            INSERT INTO contact_form_propertys(i_idproperty,i_contact_form_one,b_mail_one,created_at_one) 
            VALUES ($1,$2,true,now())
            RETURNING i_idcontact_propertys
        `,

        values: [req.i_property,idcontact],
    }

    return pool()
    .query(query)
    .then(response => response)
    .catch(err => {console.log(err);throw err})
}

const insertContactFormPropertysTwo = async (req,res,idcontact) => {
    let query = {
        text: `
            INSERT INTO contact_form_propertys(i_idproperty,i_contact_form_two,b_mail_two,created_at_two) 
            VALUES ($1,$2,true,now())
            RETURNING i_idcontact_propertys
        `,

        values: [req.i_property,idcontact],
    }

    return pool()
    .query(query)
    .then(response => response)
    .catch(err => {console.log(err);throw err})
}

const getContactFormPropertys = (req,res) => {
    let query = {
        text: `
            SELECT 
                i_idcontact_propertys,
                i_idproperty
            FROM contact_form_propertys
            WHERE i_idproperty = $1 AND b_status IS TRUE
            ORDER BY i_idproperty DESC
        `,

        values: [req.i_property],
    }

    return pool()
    .query(query)
    .then(response => response)
    .catch(err => {console.log(err);throw err})
}

const formTenant = async(req, res, id) => {
    let query = {
        text: `
            UPDATE contact_form_propertys  
            SET 
                j_form_one = $1,
                b_mail_response_one = true,
                t_mail_response_date_one = now()
            WHERE i_idcontact_propertys = $2
        `,

        values: [req, id],
    }
    console.log(query)
    return pool()
    .query(query)
    .then(response => response)
    .catch(err => {console.log(err);throw err})
}

const formLessor = async(req, res, id) => {
    let query = {
        text: `
            UPDATE contact_form_propertys  
            SET 
                j_form_two = $1,
                b_mail_response_two = true,
                t_mail_response_date_two = now()
            WHERE i_idcontact_propertys = $2
        `,

        values: [req, id],
    }

    return pool()
    .query(query)
    .then(response => response)
    .catch(err => {console.log(err);throw err})
}

const updateContactFormPropertysOne = async(req,res,idcontact,idcontact_propertys) => {
    let query = {
        text: `
            UPDATE contact_form_propertys  
            SET 
                i_idproperty = $1,
                i_contact_form_one = $2,
                b_mail_one = true,
                created_at_one = now()
            WHERE i_idcontact_propertys = $3 
        `,

        values: [req.i_property, idcontact, idcontact_propertys],
    }

    return pool()
    .query(query)
    .then(response => response)
    .catch(err => {console.log(err);throw err})
}

const updateContactFormPropertysTwo = async(req,res,idcontact,idcontact_propertys) => {
    let query = {
        text: `
            UPDATE contact_form_propertys  
            SET 
                i_idproperty = $1,
                i_contact_form_two = $2,
                b_mail_two = true,
                created_at_two = now()
            WHERE i_idcontact_propertys = $3 
        `,

        values: [req.i_property, idcontact, idcontact_propertys],
    }

    return pool()
    .query(query)
    .then(response => response)
    .catch(err => {console.log(err);throw err})
}

const validateTenant = async(req,res) => {
    let query = {
        text: `
            SELECT * 
            FROM contact_form_propertys
            WHERE b_mail_one IS TRUE AND i_idproperty = $1 AND b_status IS TRUE
        `,

        values: [req],
    }

    return pool()
    .query(query)
    .then(response => response)
    .catch(err => {console.log(err);throw err})
}

const validateLessor = async(req,res,idcontact,idcontact_propertys) => {
    let query = {
        text: `
            SELECT * 
            FROM contact_form_propertys
            WHERE b_mail_two IS TRUE AND i_idproperty = $1 AND b_status IS TRUE
        `,

        values: [req],
    }

    return pool()
    .query(query)
    .then(response => response)
    .catch(err => {console.log(err);throw err})
}

const validateResponseTenant = async(req,res) => {
    let query = {
        text: `
            SELECT count(*) validate
            FROM contact_form_propertys
            WHERE b_mail_response_one IS TRUE AND i_idcontact_propertys = $1 AND b_status IS TRUE
        `,

        values: [req],
    }

    return pool()
    .query(query)
    .then(response => response)
    .catch(err => {console.log(err);throw err})
}

const validateResponseLessor = async(req,res) => {
    let query = {
        text: `
            SELECT count(*) validate 
            FROM contact_form_propertys
            WHERE b_mail_response_two IS TRUE AND i_idcontact_propertys = $1 AND b_status IS TRUE
        `,

        values: [req],
    }

    return pool()
    .query(query)
    .then(response => response)
    .catch(err => {console.log(err);throw err})
}


const createProperty = async(req,res) => {
    let query = {
        text: `
            INSERT INTO propertys(
                v_name,
                v_address,
                v_number,
                v_unit_number,
                v_region,
                v_district,
                v_rent,
                v_type_rent)
            VALUES(
                $1,
                $2,
                $3,
                $4,
                $5,
                $6,
                $7,
                $8
            )
        `,

        values: [req.name,req.address,req.number,req.unit_number,req.region,req.district,req.rent,req.type_rent],
    }

    return pool()
    .query(query)
    .then(response => response)
    .catch(err => {console.log(err);throw err})
}

const editProperty = async(req,res) => {
    let query = {
        text: `
            UPDATE propertys
            SET 
                v_address = $1,
                v_region = $2,
                v_district = $3,
                v_name = $4,
                v_number = $5,
                v_rent = $6,
                v_type_rent = $7,
                v_unit_number = $8
            WHERE i_idproperty = $9
        `,

        values: [req.address,req.region,req.district,req.name,req.number,req.rent,req.type_rent,req.unit_number,req.idproperty,],
    }

    return pool()
    .query(query)
    .then(response => response)
    .catch(err => {console.log(err);throw err})
}


const getRegions = async (req, res, next) => {

    let query = {
        text : `SELECT * 
                FROM region`
    }
    return pool()
    .query(query)
    .then(response => response)
    .catch(error => {
        res.status(500).send({
            message: 'Ocurrio un error'
        })
        next(e)
    })
}

const getDistricts = async (req, res) => {
    
    let query = {
        text : `SELECT * 
                FROM district 
                WHERE idregion = $1`,
        values: [req.idregion]
    }

    return pool()
    .query(query)
    .then(response => response)
    .catch(error => {
        res.status(500).send({
            message : 'Ocurrio un error'
        })
        
    })

}


module.exports = {
    getDashOne,
    getDataPropertys,
    getDataPropertyID,
    insertContactForm,
    getContactFormPropertys,
    formTenant,
    formLessor,
    insertContactFormPropertysOne,
    insertContactFormPropertysTwo,
    updateContactFormPropertysOne,
    updateContactFormPropertysTwo,
    validateTenant,
    validateLessor,
    validateResponseTenant,
    validateResponseLessor,
    createProperty,
    editProperty,
    getRegions,
    getDistricts
}