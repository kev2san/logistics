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

const getDashTwo = async (req, res) => {
	let query = {
        text: `
        SELECT
            b.v_user,
            count(*) total
        FROM items_group a
        INNER JOIN users b
            ON a.i_iduser_created=b.i_iduser
        GROUP BY b.v_user
        `,

        values: [],
        }

        return pool()
        .query(query)
        .then(response => response)
        .catch(err => {console.log(err);throw err})
}

const getDashThree = async () => {
    let query = {
        text: `
        SELECT 
            SUM(case when b.v_type = 'EGRESO' THEN 1 ELSE 0 END) as expenses,
            SUM(case when b.v_type = 'INGRESO' THEN 1 ELSE 0 END) as ingress,
            SUM(case when b.v_type = 'MERMA' THEN 1 ELSE 0 END) as loss,
            COUNT(DISTINCT a.i_idgroup) movement
        FROM items_group a
        INNER JOIN items b
            ON a.i_idgroup=b.i_idgroup
        `,

        values: [],
    }

    return pool()
    .query(query)
    .then(response => response)
    .catch(err => {console.log(err);throw err})
}

const getInfoData = async(req,res) => {
    let query = {
        text: `
            SELECT 
                *
            FROM contact_form_propertys a 
            INNER JOIN propertys b
                ON a.i_idproperty=b.i_idproperty
            WHERE a.i_idproperty = $1 AND b_status IS TRUE
            ORDER BY a.i_idproperty DESC;
        `,

        values: [req.id_property],
    }

    return pool()
    .query(query)
    .then(response => response)
    .catch(err => {console.log(err);throw err})
}

const updateJhmtl = async(req,res) => {
    let query = {
        text: `
            UPDATE contact_form_propertys
            SET j_html = $1 
            WHERE i_idproperty = $2
        `,

        values: [req,req.id_property],
    }

    return pool()
    .query(query)
    .then(response => response)
    .catch(err => {console.log(err);throw err})
}

const saveDocument = async(req,res,nameDocument) => {
    let query = {
        text: `
            INSERT INTO documents_generated(i_idcontact_form_propertys,name_contract,created_by)
            VALUES($1,$2,$3)
        `,

        values: [req.id_property,nameDocument,req.iduser],
    }

    return pool()
    .query(query)
    .then(response => response)
    .catch(err => {console.log(err);throw err})
}

const getDocumentsName = async(req,res) => {
    let query = {
        text: `
            SELECT 
                i_idcontact_form_propertys,
                name_contract,
                created_by
            FROM documents_generated
            WHERE i_idcontact_form_propertys = $1
            ORDER BY i_iddocuments_generated DESC
        `,

        values: [req.id_property],
    }

    return pool()
    .query(query)
    .then(response => response)
    .catch(err => {console.log(err);throw err})
}


module.exports = {
    getInfoData,
    updateJhmtl,
    saveDocument,
    getDocumentsName
}