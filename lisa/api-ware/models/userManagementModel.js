const pool = require('./connectModel')
const error = require('../middlewares/errorManagement')

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

const createUser = async (req, res, jwt) => {
	let query = {
        text : `INSERT INTO users(
                        v_names,v_surnames,v_identification,d_birthdate,
                        v_country,v_personal_status,v_sex,n_phone,
                        v_email,i_idregion,i_iddistrict,v_address,
                        v_payment,v_interim_regime,v_quotation_fund,v_fonasa_isapre,
                        v_fun,n_plan_uf,v_afc,i_iduser_level,
                        v_area,n_center_cost,v_supervisor,n_salary,
                        v_contract_type,d_date_admission,v_schedule,v_user_created
                )VALUES(
                        $1,$2,$3,$4,
                        $5,$6,$7,$8,
                        $9,$10,$11,$12,
                        $13,$14,$15,$16,
                        $17,$18,$19,$20,
                        $21,$22,$23,$24,
                        $25,$26,$27,$28
                )
        `,

        values: [req.name,req.surnames,req.identification,req.birthdate,
                req.country,req.personal_status,req.sex,req.phone,
                req.email,req.region,req.district,req.address,
                req.payment,req.interim_regime,req.quotation_fund,req.fonasa_isapre,
                req.fun,req.plan_uf,req.afc,req.profile,
                req.area,req.center_cost,req.supervisor,req.salary,
                req.contract_type,req.date_admission,req.schedule,jwt.username],
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
        getRegion,
        getDistrict,
        createUser
}