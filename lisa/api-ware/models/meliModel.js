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
                AND b.b_meli IS TRUE
                AND b.i_idpartner = $1;
        `,

        values: [req.i_idpartner],
    }

    return pool()
    .query(query)
    .then(response => response)
    .catch(err => {throw err})
}

const getPickupByPartnerMeli = async (req, res) => {
	let query = {
        text: `
            SELECT 
                a.i_idpartner,
                a.v_name,
                b.i_idpartner_pickup,
                b.v_partner_pickup,
                b.v_token_meli,
                to_char(b.d_token_meli, 'MM-DD HH24:MI') d_token_meli,
                to_char(now(), 'MM-DD HH24:MI') d_current_date,
                to_char((b.d_token_meli + interval '6 hour'), 'MM-DD HH24:MI') d_token_meli_end,
                (extract('epoch' from now() - d_token_meli) / 60) / 60 in_time,
                b.v_code_meli
            FROM partners a
            INNER JOIN partner_pickup b
                ON a.i_idpartner=b.i_idpartner
            WHERE 
                a.b_active IS TRUE 
                AND b.b_active IS TRUE
                AND b_meli IS TRUE
        `,

        values: [],
    }

    return pool()
    .query(query)
    .then(response => response)
    .catch(err => {throw err})
}

const registerToken = async (req, res, response) => {
	let query = {
        text: `
            UPDATE partner_pickup
            SET 
                v_code_meli = $1,
                v_token_meli = $2,
                d_token_meli = now()
            WHERE i_idpartner_pickup = $3
        `,

        values: [req.v_code_meli, response.access_token, req.i_idpartner_pickup],
    }

    return pool()
    .query(query)
    .then(response => response)
    .catch(err => {throw err})
}

const getCredentials = async (req, res) => {
	let query = {
        text: `
            SELECT 
                b.i_idpartner_pickup,
                b.v_partner_pickup,
                b.v_token_meli,
                b.v_code_meli
            FROM partner_pickup b
            WHERE 
                b.i_idpartner_pickup = $1
                AND b.b_active IS TRUE
                AND b_meli IS TRUE
        `,

        values: [req.i_idpartner_pickup],
    }

    return pool()
    .query(query)
    .then(response => response)
    .catch(err => {throw err})
}

const registerItem = async (req, res, result) => {
	let query = {
        text: `
            SELECT * FROM fn_upload_ml_json($1, $2, $3)
        `,

        values: [result, req.i_idpartner, req.i_idpartner_pickup],
    }

    return pool()
    .query(query)
    .then(response => response)
    .catch(err => {throw err})
}

module.exports = {
    getPartner,
	getPickupByPartner,
    getPickupByPartnerMeli,
    registerToken,
    getCredentials,
    registerItem
}